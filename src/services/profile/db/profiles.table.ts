type UUID = string;

export interface ProfilesTable {
  id: UUID;
  userId: string;
  surname: string;
  firstname: string;
  isDriver: boolean;
}
