export interface InternalPosition {
  id: number,
  city: string,
  description: string,
  positionType: string,
  availablePositions: number,
  duration: number,
  physicalObjects: string[],
  providerContactEmail: string,
  providerContactName: string,
  providerContactPhone: string,
  title: string,
  name: string,
  publication_date: Date,
  atlasPositionId: number,
  afm?: string
}
