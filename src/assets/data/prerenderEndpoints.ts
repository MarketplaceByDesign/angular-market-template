import { PrerenderEndpointsConfig } from '@mbd-common-libs/angular-common-services';

export const prerenderEndpoints: PrerenderEndpointsConfig = {
    excludeAPICall: ['/v2/stats/increment/'],
};
