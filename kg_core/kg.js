/*  Copyright 2022 EBRAINS AISBL
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*  http://www.apache.org/licenses/LICENSE-2.0.
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*
*  This open source software code was developed in part or in whole in the
*  Human Brain Project, funded from the European Union's Horizon 2020
*  Framework Programme for Research and Innovation under
*  Specific Grant Agreements No. 720270, No. 785907, and No. 945539
*  (Human Brain Project SGA1, SGA2 and SGA3).
*/

import { SimpleToken, ClientCredentials } from "kgCoreJs/oauth";
import { KGConfig, CallableTokenHandler } from "kgCoreJs/communication";


const _calculateBaseUrl = host => `http${host.startsWith('localhost')?'':'s'}://${host}/v3-beta/`;


const _createKgConfig = (host, tokenHandler, clientTokenHandler = null) => new KGConfig(_calculateBaseUrl(host), tokenHandler, clientTokenHandler, "https://kg.ebrains.eu/api/instances/");

class Client {
    constructor(host, tokenHandler, clientTokenHandler = null) {
        if(!host) {
            throw new Error("No hostname specified");
        } else if(!tokenHandler) {
            throw new Error("No token provided");
        }
        const kgConfig = _createKgConfig(host, tokenHandler, clientTokenHandler);
        this.instances = new Instances(kgConfig);
        this.jsonld = new Jsonld(kgConfig);
        this.queries = new Queries(kgConfig);
        this.spaces = new Spaces(kgConfig);
        this.types = new Types(kgConfig);
        this.users = new Users(kgConfig);
        
    }
}

class Admin extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    /*Assign a type to a space*/
    assign_type_to_space(space, target_type) {
        params = { 
            "type": target_type
        }
        const result = this._put(path=`spaces/${space}/types`, payload=null, params=params);
        return result;
    }

    /*Update invitation scope for this instance*/
    calculate_instance_invitation_scope(instance_id) {
        params = {}
        const result = this._put(path=`instances/${instance_id}/invitationScope`, payload=null, params=params);
        return result;
    }

    /*Explicitly specify a space*/
    create_space_definition(space, autorelease, client_space, defer_cache) {
        params = { 
            "autorelease": autorelease,
            "clientSpace": client_space,
            "deferCache": defer_cache
        }
        const result = this._put(path=`spaces/${space}/specification`, payload=null, params=params);
        return result;
    }

    /*Specify a type*/
    create_type_definition(payload, target_type, is_global) {
        params = { 
            "global": is_global,
            "type": target_type
        }
        const result = this._put(path="types/specification", payload=payload, params=params);
        return result;
    }

    /*Upload a property specification either globally or for the requesting client*/
    define_property(payload, property_name, is_global) {
        params = { 
            "global": is_global,
            "property": property_name
        }
        const result = this._put(path="properties", payload=payload, params=params);
        return result;
    }

    /*Define a property specification either globally for the requesting client*/
    define_property_for_type(payload, property_name, target_type, is_global) {
        params = { 
            "global": is_global,
            "property": property_name,
            "type": target_type
        }
        const result = this._put(path="propertiesForType", payload=payload, params=params);
        return result;
    }

    /*Upload a property specification either globally or for the requesting client*/
    deprecate_property(property_name, is_global) {
        params = { 
            "global": is_global,
            "property": property_name
        }
        const result = this._delete(path="properties", params=params);
        return result;
    }

    /*Deprecate a property specification for a specific type either globally or for the requesting client*/
    deprecate_property_for_type(property_name, target_type, is_global) {
        params = { 
            "global": is_global,
            "property": property_name,
            "type": target_type
        }
        const result = this._delete(path="propertiesForType", params=params);
        return result;
    }

    
    get_all_role_definitions() {
        params = {}
        const result = this._get(path="setup/permissions", params=params);
        return result;
    }

    
    get_claim_for_role(role, space) {
        params = { 
            "space": space
        }
        const result = this._get(path=`setup/permissions/${role}`, params=params);
        return result;
    }

    /*List instances with invitations*/
    list_instances_with_invitations() {
        params = {}
        const result = this._get(path="instancesWithInvitations", params=params);
        return result;
    }

    
    register_terms_of_use(payload) {
        params = {}
        const result = this._put(path="setup/termsOfUse", payload=payload, params=params);
        return result;
    }

    /*Remove a space definition*/
    remove_space_definition(space) {
        params = {}
        const result = this._delete(path=`spaces/${space}/specification`, params=params);
        return result;
    }

    /*Remove a type definition*/
    remove_type_definition(is_global, target_type) {
        params = { 
            "type": target_type,
            "global": is_global
        }
        const result = this._delete(path="types/specification", params=params);
        return result;
    }

    /*Remove a type in space definition*/
    remove_type_from_space(space, target_type) {
        params = { 
            "type": target_type
        }
        const result = this._delete(path=`spaces/${space}/types`, params=params);
        return result;
    }

    /*Trigger a rerun of the events of this space*/
    rerun_events(space) {
        params = {}
        const result = this._put(path=`spaces/${space}/eventHistory`, payload=null, params=params);
        return result;
    }

    /*Triggers the inference of all documents of the given space*/
    trigger_inference(space, identifier, is_async) {
        params = { 
            "identifier": identifier,
            "async": is_async
        }
        const result = this._post(path=`spaces/${space}/inference`, payload=null, params=params);
        return result;
    }

    
    update_claim_for_role(payload, remove, role, space) {
        params = { 
            "space": space,
            "remove": remove
        }
        const result = this._patch(path=`setup/permissions/${role}`, payload=payload, params=params);
        return result;
    }

}

class Instances extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    /*Replace contribution to an existing instance*/
    contribute_to_full_replacement(payload, instance_id, extended_response_configuration) {
        params = { 
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._put(path=`instances/${instance_id}`, payload=payload, params=params);
        return result;
    }

    /*Partially update contribution to an existing instance*/
    contribute_to_partial_replacement(payload, instance_id, extended_response_configuration) {
        params = { 
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._patch(path=`instances/${instance_id}`, payload=payload, params=params);
        return result;
    }

    /*Create new instance with a system generated id*/
    create_new(payload, space, extended_response_configuration) {
        params = { 
            "space": space,
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._post(path="instances", payload=payload, params=params);
        return result;
    }

    /*Create new instance with a client defined id*/
    create_new_with_id(payload, instance_id, space, extended_response_configuration) {
        params = { 
            "space": space,
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._post(path=`instances/${instance_id}`, payload=payload, params=params);
        return result;
    }

    /*Delete an instance*/
    delete(instance_id) {
        params = {}
        const result = this._delete(path=`instances/${instance_id}`, params=params);
        return result;
    }

    /*Get the instance*/
    get_by_id(instance_id, stage, extended_response_configuration) {
        params = { 
            "stage": stage,
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._get(path=`instances/${instance_id}`, params=params);
        return result;
    }

    /*Read instances by the given list of (external) identifiers*/
    get_by_identifiers(payload, stage, extended_response_configuration) {
        params = { 
            "stage": stage,
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._post(path="instancesByIdentifiers", payload=payload, params=params);
        return result;
    }

    /*Bulk operation of /instances/{id} to read instances by their UUIDs*/
    get_by_ids(payload, stage, extended_response_configuration) {
        params = { 
            "stage": stage,
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._post(path="instancesByIds", payload=payload, params=params);
        return result;
    }

    /*Get incoming links for a specific instance (paginated)*/
    get_incoming_links(instance_id, property_name, target_type, stage, pagination) {
        params = { 
            "stage": stage,
            "property": property_name,
            "type": target_type,
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results
        }
        const result = this._get(path=`instances/${instance_id}/incomingLinks`, params=params);
        return result;
    }

    /*Get the release status for an instance*/
    get_release_status(instance_id, release_tree_scope) {
        params = { 
            "releaseTreeScope": release_tree_scope
        }
        const result = this._get(path=`instances/${instance_id}/release/status`, params=params);
        return result;
    }

    /*Get the release status for multiple instances*/
    get_release_status_by_ids(payload, release_tree_scope) {
        params = { 
            "releaseTreeScope": release_tree_scope
        }
        const result = this._post(path="instancesByIds/release/status", payload=payload, params=params);
        return result;
    }

    /*Get the scope for the instance by its KG-internal ID*/
    get_scope(instance_id, apply_restrictions, return_permissions, stage) {
        params = { 
            "stage": stage,
            "returnPermissions": return_permissions,
            "applyRestrictions": apply_restrictions
        }
        const result = this._get(path=`instances/${instance_id}/scope`, params=params);
        return result;
    }

    /*Create or update an invitation for the given user to review the given instance*/
    invite_user_for(instance_id, user_id) {
        params = {}
        const result = this._put(path=`instances/${instance_id}/invitedUsers/${user_id}`, payload=null, params=params);
        return result;
    }

    /*Returns a list of instances according to their types*/
    list(target_type, filter_property, filter_value, search_by_label, space, stage, response_configuration, pagination) {
        params = { 
            "stage": stage,
            "type": target_type,
            "space": space,
            "searchByLabel": search_by_label,
            "filterProperty": filter_property,
            "filterValue": filter_value,
            "returnPayload": response_configuration.return_payload,
            "returnPermissions": response_configuration.return_permissions,
            "returnAlternatives": response_configuration.return_alternatives,
            "returnEmbedded": response_configuration.return_embedded,
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results
        }
        const result = this._get(path="instances", params=params);
        return result;
    }

    /*List invitations for review for the given instance*/
    list_invitations(instance_id) {
        params = {}
        const result = this._get(path=`instances/${instance_id}/invitedUsers`, params=params);
        return result;
    }

    /*Move an instance to another space*/
    move(instance_id, space, extended_response_configuration) {
        params = { 
            "returnIncomingLinks": extended_response_configuration.return_incoming_links,
            "incomingLinksPageSize": extended_response_configuration.incoming_links_page_size,
            "returnPayload": extended_response_configuration.return_payload,
            "returnPermissions": extended_response_configuration.return_permissions,
            "returnAlternatives": extended_response_configuration.return_alternatives,
            "returnEmbedded": extended_response_configuration.return_embedded
        }
        const result = this._put(path=`instances/${instance_id}/spaces/${space}`, payload=null, params=params);
        return result;
    }

    /*Release or re-release an instance*/
    release(instance_id, revision) {
        params = { 
            "revision": revision
        }
        const result = this._put(path=`instances/${instance_id}/release`, payload=null, params=params);
        return result;
    }

    /*Revoke an invitation for the given user to review the given instance*/
    revoke_user_invitation(instance_id, user_id) {
        params = {}
        const result = this._delete(path=`instances/${instance_id}/invitedUsers/${user_id}`, params=params);
        return result;
    }

    /*Unrelease an instance*/
    unrelease(instance_id) {
        params = {}
        const result = this._delete(path=`instances/${instance_id}/release`, params=params);
        return result;
    }

}

class Jsonld extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    /*Normalizes the passed payload according to the EBRAINS KG conventions*/
    normalize_payload(payload) {
        params = {}
        const result = this._post(path="jsonld/normalizedPayload", payload=payload, params=params);
        return result;
    }

}

class Queries extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    /*Execute a stored query to receive the instances*/
    execute_query_by_id(query_id, additional_request_params, instance_id, restrict_to_spaces, stage, pagination) {
        params = { 
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results,
            "stage": stage,
            "instanceId": instance_id,
            "restrictToSpaces": restrict_to_spaces
        }
        for k, v in additional_request_params.items():
            if k not in params:
                params[k] = v
        const result = this._get(path=`queries/${query_id}/instances`, params=params);
        return result;
    }

    /*Get the query specification with the given query id in a specific space*/
    get_query_specification(query_id) {
        params = {}
        const result = this._get(path=`queries/${query_id}`, params=params);
        return result;
    }

    /*List the queries and filter them by root type and/or text in the label, name or description*/
    list_per_root_type(search, target_type, pagination) {
        params = { 
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results,
            "type": target_type,
            "search": search
        }
        const result = this._get(path="queries", params=params);
        return result;
    }

    /*Remove a query specification*/
    remove_query(query_id) {
        params = {}
        const result = this._delete(path=`queries/${query_id}`, params=params);
        return result;
    }

    /*Create or save a query specification*/
    save_query(payload, query_id, space) {
        params = { 
            "space": space
        }
        const result = this._put(path=`queries/${query_id}`, payload=payload, params=params);
        return result;
    }

    /*Execute the query in the payload in test mode (e.g. for execution before saving with the KG QueryBuilder)*/
    test_query(payload, additional_request_params, instance_id, restrict_to_spaces, stage, pagination) {
        params = { 
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results,
            "stage": stage,
            "instanceId": instance_id,
            "restrictToSpaces": restrict_to_spaces
        }
        for k, v in additional_request_params.items():
            if k not in params:
                params[k] = v
        const result = this._post(path="queries", payload=payload, params=params);
        return result;
    }

}

class Spaces extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    
    get(space, permissions) {
        params = { 
            "permissions": permissions
        }
        const result = this._get(path=`spaces/${space}`, params=params);
        return result;
    }

    
    list(permissions, pagination) {
        params = { 
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results,
            "permissions": permissions
        }
        const result = this._get(path="spaces", params=params);
        return result;
    }

}

class Types extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    /*Returns the types according to the list of names - either with property information or without*/
    get_by_name(payload, space, stage, with_incoming_links, with_properties) {
        params = { 
            "stage": stage,
            "withProperties": with_properties,
            "withIncomingLinks": with_incoming_links,
            "space": space
        }
        const result = this._post(path="typesByName", payload=payload, params=params);
        return result;
    }

    /*Returns the types available - either with property information or without*/
    list(space, stage, with_incoming_links, with_properties, pagination) {
        params = { 
            "stage": stage,
            "space": space,
            "withProperties": with_properties,
            "withIncomingLinks": with_incoming_links,
            "from": pagination.start,
            "size": pagination.size,
            "returnTotalResults": pagination.return_total_results
        }
        const result = this._get(path="types", params=params);
        return result;
    }

}

class Users extends RequestsWithTokenHandler {
    constructor(config) {
        super(config);
    }
    

    /*Accept the terms of use in the given version*/
    accept_terms_of_use(version) {
        params = {}
        const result = this._post(path=`users/termsOfUse/${version}/accept`, payload=null, params=params);
        return result;
    }

    /*Get the endpoint of the openid configuration*/
    get_open_id_config_url() {
        params = {}
        const result = this._get(path="users/authorization/config", params=params);
        return result;
    }

    /*Get the current terms of use*/
    get_terms_of_use() {
        params = {}
        const result = this._get(path="users/termsOfUse", params=params);
        return result;
    }

    /*Retrieve user information from the passed token (including detailed information such as e-mail address)*/
    my_info() {
        params = {}
        const result = this._get(path="users/me", params=params);
        return result;
    }

}


class ClientBuilder {
    constructor(hostName) {
        this._hostName = hostName;
        this._tokenHandler = null;
        this._clientTokenHandler = null;
    }

    _resolveClientTokenHandler() {
        if(!this._clientTokenHandler) {
            if("KG_CLIENT_ID" in process.env && "KG_CLIENT_SECRET" in process.env){
                return new ClientCredentials(process.env["KG_CLIENT_ID"], process.env["KG_CLIENT_SECRET"]);
            } else if("KG_CLIENT_TOKEN" in process.env) {
                return new SimpleToken(process.env["KG_CLIENT_TOKEN"]);
            } else {
                return null;
            }
        } 
        return this._clientTokenHandler;
    }

    withToken(token = null) {
        this._tokenHandler = new SimpleToken(token?token:process.env["KG_TOKEN"]);
        return this;
    }

    withCustomTokenProvider(tokenProvider) {
        this._tokenHandler = new CallableTokenHandler(tokenProvider);
        return this;
    }

    withCredentials(client_id = null, client_secret = null) {
        this._tokenHandler = new ClientCredentials(client_id ? client_id : process.env["KG_CLIENT_ID"], client_secret ? client_secret : process.env["KG_CLIENT_SECRET"]);
        return this;
    }

    addClientAuthentication(client_id = null, client_secret = null) {
        this._clientTokenHandler = new ClientCredentials(client_id ? client_id : process.env["KG_CLIENT_ID"], client_secret ? client_secret : process.env["KG_CLIENT_SECRET"]);
        return this;
    }
        
    build() {
        return new Client(this._hostName, this._tokenHandler, this._resolveClientTokenHandler());
    }

    buildAdmin() {
        return new Admin(_createKgConfig(this._hostName, this._tokenHandler, this._resolveClientTokenHandler()));
    }
        
}

const kg = (host = "core.kg.ebrains.eu") => new ClientBuilder(host);
    
