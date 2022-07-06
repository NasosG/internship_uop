export interface InternalPosition {
  id: number,
  city: string,
  description: string,
  position_type: string,
  available_positions: number,
  duration: number,
  physicalObjects: string[],
  providerContactEmail: string,
  providerContactName: string,
  providerContactPhone: string,
  title: string,
  name: string,
  publication_date: string,
  atlasPositionId: number,
  afm?: string
}
