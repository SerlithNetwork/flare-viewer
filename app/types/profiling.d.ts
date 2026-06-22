export interface FlareProfileData {}

export interface FlareProfileData$View extends FlareProfileData {
  key: string;
  server_brand: string;
  server_version: string;
  os_family: string;
  os_version: string;
  jvm_vendor: string;
  jvm_version: string;
  storage: string;
  data_samples: number;
  timeline_samples: number;
  refreshed_at: string;
  created_at: string;
}
