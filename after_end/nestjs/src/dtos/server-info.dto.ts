import { FeatureFlags } from '@app/cores/system-config.core';


export class ServerFeaturesDto implements FeatureFlags {
  // smartSearch!: boolean;
  configFile!: boolean;
  // facialRecognition!: boolean;
  // map!: boolean;
  // trash!: boolean;
  // reverseGeocoding!: boolean;
  oauth!: boolean;
  oauthAutoLaunch!: boolean;
  passwordLogin!: boolean;
  // sidecar!: boolean;
  // search!: boolean;
}
