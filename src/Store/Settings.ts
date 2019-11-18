import {
    Module,
    Mutation,
    VuexModule,
} from 'vuex-module-decorators';

@Module({ namespaced: true, name: 'settings' })
export default class Settings extends VuexModule {
    public webPushEnabled: boolean = false;
    @Mutation
    public WebPushEnabled(val: boolean) {
        this.webPushEnabled = val;
    }
}
