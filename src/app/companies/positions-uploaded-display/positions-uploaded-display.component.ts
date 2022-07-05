import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyService}  from '../company.service';
import { InternalPosition } from '../internal-position.model';

@Component({
  selector: 'app-positions-uploaded-display',
  templateUrl: './positions-uploaded-display.component.html',
  styleUrls: ['./positions-uploaded-display.component.css']
})
export class PositionsUploadedDisplayComponent implements OnInit {
  positions: InternalPosition[] = [];

  constructor(public authService: AuthService, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getInternalPositions()
      .subscribe((positions: InternalPosition[]) => {
        this.positions = positions;
    })
  }

}
