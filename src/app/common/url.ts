import { environment } from "../../environments/environment";
export class Url {
    public static API = {
        register : environment.url+'authentication/register',
        compRegister : environment.url+'authentication/compRegister',
        DELETE_USER :environment.url +'authentication/delete_User',
        USER_INFO : environment.url + 'authentication/userinfo',
        USER_INFO_VIMAGE : environment.url + 'authentication/userinfo_vimage',
        USERINFO_UPDATE_VIMAGE :environment.url + 'authentication/userinfo_update_vimage'
    }
} 