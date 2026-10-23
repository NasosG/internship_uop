import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { StudentComponent } from '../students/student/student.component';
import { AdminPanelComponent } from '../admin-panels/admin-panel/admin-panel.component';

const API = environment.apiUrl;
const NOW = new Date('2026-10-22T10:00:00Z');

/** Builds a JWT shaped like the backend ones (base64url, no padding) that expires in the given seconds */
function makeToken(expiresInSeconds: number, claims: any = { userId: 1211, role: 'student' }): string {
  const b64 = (o: any) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const now = Math.floor(Date.now() / 1000);
  return b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64({ ...claims, iat: now, exp: now + expiresInSeconds }) + '.signature';
}

describe('Auth behaviour (token, interceptor, guard, login flows)', () => {
  let router: any;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let swal: jasmine.Spy;

  const setup = (extraProviders: any[] = [], beforeInject: () => void = () => {}) => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        ...extraProviders
      ]
    });
    beforeInject();
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  };

  beforeEach(() => {
    localStorage.clear();
    jasmine.clock().install();
    jasmine.clock().mockDate(NOW);
    router = { url: '/', events: new Subject(), navigate: jasmine.createSpy('navigate'), navigateByUrl: jasmine.createSpy('navigateByUrl') };
    swal = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    localStorage.clear();
    (environment as any).production = false;
  });

  // ------------------------------------------------------------------ AuthService
  describe('AuthService', () => {
    beforeEach(() => setup());

    it('stores a new token and reports the user as logged in', () => {
      const auth = TestBed.inject(AuthService);
      const token = makeToken(4 * 3600);
      auth.setToken(token);
      auth.setSessionId(1211);
      expect(localStorage.getItem('token')).toBe(token);
      expect(auth.getToken()).toBe(token);
      expect(auth.isLoggedIn()).toBeTrue();
      expect(auth.getSessionId()).toBe(1211);
    });

    it('a new login replaces an older token (the old code kept the first one)', () => {
      const auth = TestBed.inject(AuthService);
      const first = makeToken(3600), second = makeToken(4 * 3600, { userId: 1211, role: 'student', n: 2 });
      auth.setToken(first);
      auth.setToken(second);
      expect(auth.getToken()).toBe(second);
      expect(localStorage.getItem('token')).toBe(second);
    });

    it('never returns an expired token and treats the user as logged out', () => {
      localStorage.setItem('token', makeToken(-10));
      const auth = TestBed.inject(AuthService);
      expect(auth.getToken()).toBeUndefined();
      expect(auth.isLoggedIn()).toBeFalse();
    });

    it('an expired token found on page load does not redirect by itself (user may be arriving from SSO)', () => {
      localStorage.setItem('token', makeToken(-10));
      TestBed.inject(AuthService);
      jasmine.clock().tick(10 * 60 * 1000);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(swal).not.toHaveBeenCalled();
    });

    it('logs the user out exactly when the 4 hour token expires, with the Greek Swal message', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(4 * 3600));
      auth.setSessionId(1211);
      jasmine.clock().tick(4 * 3600 * 1000 - 1000);
      expect(router.navigate).not.toHaveBeenCalled();
      jasmine.clock().tick(2000);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('sessionId')).toBeNull();
      expect(swal).toHaveBeenCalledTimes(1);
      expect((swal.calls.mostRecent().args[0] as any).title).toBe('Λήξη συνεδρίας');
      expect((swal.calls.mostRecent().args[0] as any).text).toBe('Η συνεδρία σας έληξε. Παρακαλώ συνδεθείτε ξανά.');
    });

    it('a still valid token restores its timer after a page reload / browser restart', () => {
      localStorage.setItem('token', makeToken(3600)); // 1 hour left
      TestBed.inject(AuthService);
      jasmine.clock().tick(3600 * 1000 + 1000);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(swal).toHaveBeenCalledTimes(1);
    });

    it('sessionExpired shows the message only once, even if called many times (e.g. parallel 401s)', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(3600));
      auth.sessionExpired();
      auth.sessionExpired();
      auth.sessionExpired();
      expect(swal).toHaveBeenCalledTimes(1);
    });

    it('a user who was never logged in is redirected without the "session expired" message', () => {
      const auth = TestBed.inject(AuthService);
      auth.sessionExpired();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(swal).not.toHaveBeenCalled();
    });

    it('logout clears token, session id and the expiry timer', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(3600));
      auth.setSessionId(1211);
      auth.logout();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('sessionId')).toBeNull();
      expect(auth.isLoggedIn()).toBeFalse();
      router.navigate.calls.reset();
      jasmine.clock().tick(2 * 3600 * 1000);
      expect(router.navigate).not.toHaveBeenCalled(); // the old timer does not fire again
    });
  });

  // ------------------------------------------------------------------ Interceptor
  describe('AuthInterceptor', () => {
    beforeEach(() => setup());

    it('sends the token as Bearer header on every API call', () => {
      const auth = TestBed.inject(AuthService);
      const token = makeToken(4 * 3600);
      auth.setToken(token);
      http.get(API + '/students/getStudentById/1211').subscribe();
      const req = httpMock.expectOne(API + '/students/getStudentById/1211');
      expect(req.request.headers.get('authorization')).toBe('Bearer ' + token);
      req.flush([]);
      httpMock.verify();
    });

    it('does not refresh while more than 30 minutes are left', () => {
      TestBed.inject(AuthService).setToken(makeToken(2 * 3600));
      http.get(API + '/students/getPhase/98').subscribe();
      expect(httpMock.match(r => r.url.endsWith('/auth/refresh')).length).toBe(0);
      httpMock.expectOne(API + '/students/getPhase/98').flush({});
      httpMock.verify();
    });

    it('activity in the last 30 minutes renews the token once, and the new token is used afterwards', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(10 * 60));
      http.get(API + '/students/getPhase/98').subscribe();
      http.get(API + '/students/getStudentApplications/1211').subscribe(); // parallel call: no second refresh
      const refresh = httpMock.match(r => r.url === API + '/auth/refresh');
      expect(refresh.length).toBe(1);
      expect(refresh[0].request.method).toBe('POST');
      const renewed = makeToken(4 * 3600, { userId: 1211, role: 'student', renewed: true });
      refresh[0].flush({ token: renewed, expiresIn: 14400, userId: 1211 });
      httpMock.match(() => true).forEach(r => r.flush({}));
      expect(localStorage.getItem('token')).toBe(renewed);
      http.get(API + '/students/getPhase/98').subscribe();
      expect(httpMock.expectOne(API + '/students/getPhase/98').request.headers.get('authorization')).toBe('Bearer ' + renewed);
      // and the user is not logged out at the old expiry time
      jasmine.clock().tick(11 * 60 * 1000);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('login calls never trigger a refresh', () => {
      TestBed.inject(AuthService).setToken(makeToken(5 * 60));
      http.post(API + '/company/login', { username: 'x', password: 'y' }).subscribe({ error: () => {} });
      expect(httpMock.match(r => r.url.endsWith('/auth/refresh')).length).toBe(0);
      httpMock.expectOne(API + '/company/login').flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('a 401 from the auth middleware (X-Auth-Error) logs the user out', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(3600));
      const expired = spyOn(auth, 'sessionExpired').and.callThrough();
      let status = 0;
      http.get(API + '/students/getStudentById/1211').subscribe({ error: e => status = e.status });
      httpMock.expectOne(API + '/students/getStudentById/1211').flush({ message: 'Auth failed! jwt expired' }, { status: 401, statusText: 'Unauthorized', headers: { 'X-Auth-Error': 'true' } });
      expect(status).toBe(401);
      expect(expired).toHaveBeenCalledTimes(1);
      expect(swal).toHaveBeenCalledTimes(1);
    });

    it('a 401 from a controller error (no X-Auth-Error) does NOT log the user out', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(3600));
      const expired = spyOn(auth, 'sessionExpired');
      http.post(API + '/students/insertAssignment/1211', {}).subscribe({ error: () => {} });
      httpMock.expectOne(API + '/students/insertAssignment/1211').flush({ message: "Cannot read properties of undefined (reading 'student_id')" }, { status: 401, statusText: 'Unauthorized' });
      expect(expired).not.toHaveBeenCalled();
      expect(auth.isLoggedIn()).toBeTrue();
    });

    it('a 403 (e.g. wrong role / another student id) does NOT log the user out', () => {
      const auth = TestBed.inject(AuthService);
      auth.setToken(makeToken(3600));
      const expired = spyOn(auth, 'sessionExpired');
      http.get(API + '/students/getStudentById/9').subscribe({ error: () => {} });
      httpMock.expectOne(API + '/students/getStudentById/9').flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
      expect(expired).not.toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------------ Guard (production behaviour)
  describe('AuthGuard', () => {
    const snap = (query: any = {}) => ({ queryParamMap: convertToParamMap(query) } as any);
    beforeEach(() => { setup(); (environment as any).production = true; });

    it('lets the SSO redirect through (it carries the new token in the URL)', () => {
      expect(TestBed.inject(AuthGuard).canActivateChild(snap({ token: 'x', uuid: '1211' }), { url: '/student/login?token=x&uuid=1211' } as any)).toBeTrue();
    });

    it('lets the /admin landing page through (it only redirects to the SSO)', () => {
      expect(TestBed.inject(AuthGuard).canActivateChild(snap(), { url: '/admin' } as any)).toBeTrue();
    });

    it('lets a logged in user open protected pages', () => {
      TestBed.inject(AuthService).setToken(makeToken(3600));
      expect(TestBed.inject(AuthGuard).canActivateChild(snap(), { url: '/student/1211' } as any)).toBeTrue();
    });

    it('sends a user with an expired token home with the "session expired" message', () => {
      localStorage.setItem('token', makeToken(-60));
      const allowed = TestBed.inject(AuthGuard).canActivateChild(snap(), { url: '/student/1211' } as any);
      expect(allowed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(swal).toHaveBeenCalledTimes(1);
    });

    it('sends a visitor without a token home without a message', () => {
      const allowed = TestBed.inject(AuthGuard).canActivateChild(snap(), { url: '/department-manager/11' } as any);
      expect(allowed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(swal).not.toHaveBeenCalled();
    });

    it('in local development (production: false) never blocks', () => {
      (environment as any).production = false;
      expect(TestBed.inject(AuthGuard).canActivateChild(snap(), { url: '/student/8' } as any)).toBeTrue();
    });
  });

  // ------------------------------------------------------------------ Real page flows
  describe('Login flows of real pages', () => {
    const translate = { addLangs: () => {}, setDefaultLang: () => {}, use: () => of({}), instant: (k: string) => k, get: (k: string) => of(k) };

    it('student arriving from the SSO: every first call carries the NEW token and the student\'s OWN id', () => {
      (environment as any).production = true;
      const token = makeToken(4 * 3600);
      router.url = '/student/login?token=' + token + '&uuid=1211';
      setup([
        { provide: ActivatedRoute, useValue: { queryParams: of({ token, uuid: '1211' }) } },
        { provide: TranslateService, useValue: translate },
        { provide: MatDialog, useValue: {} }
      ], () => TestBed.overrideTemplate(StudentComponent, ''));
      const fixture = TestBed.createComponent(StudentComponent);
      fixture.componentInstance.ngOnInit();

      const first = httpMock.match(() => true);
      expect(first.map(r => r.request.url)).toContain(API + '/students/checkUserAcceptance/1211');
      expect(first.map(r => r.request.url)).toContain(API + '/students/getStudentById/1211');
      for (const r of first) expect(r.request.headers.get('authorization')).toBe('Bearer ' + token);

      // accepted terms -> goes to the student page and loads the student
      first.find(r => r.request.url.endsWith('/checkUserAcceptance/1211'))!.flush({ accepted: true });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/student/1211');
      const student = [{ sso_uid: 1211, department_id: 98, schacdateofbirth: '19990101', user_ssn: 'urn:x:SSN:12345678901' }];
      httpMock.match(r => r.url.endsWith('/getStudentById/1211')).forEach(r => r.flush(student));
      const next = httpMock.match(() => true);
      for (const r of next) {
        expect(r.request.headers.get('authorization')).toBe('Bearer ' + token);
        // routes that carry a student id use the student's own id (backend ownership check passes)
        if (/getStudentById|getCommentByStudentIdAndSubject/.test(r.request.url)) expect(r.request.urlWithParams).toContain('1211');
      }
      expect(next.map(r => r.request.url)).toContain(API + '/students/getPhase/98');
    });

    it('admin panel (the fixed bug): the users list request carries the token from the SSO redirect', () => {
      (environment as any).production = true;
      const token = makeToken(4 * 3600, { userId: 45, role: 'admin' });
      localStorage.setItem('token', makeToken(4 * 3600, { userId: 12, role: 'office' })); // an older token of another role
      router.url = '/admin/login?token=' + token + '&uuid=45';
      setup([
        { provide: ActivatedRoute, useValue: { queryParams: of({ token, uuid: '45' }) } },
        { provide: TranslateService, useValue: translate },
        { provide: MatDialog, useValue: {} }
      ], () => TestBed.overrideTemplate(AdminPanelComponent, ''));
      const fixture = TestBed.createComponent(AdminPanelComponent);
      fixture.componentInstance.ngOnInit();
      const users = httpMock.expectOne(r => r.url.includes('/admin/getUsers'));
      expect(users.request.headers.get('authorization')).toBe('Bearer ' + token);
      expect(router.navigate).toHaveBeenCalledWith(['/admin/45']);
    });
  });
});
