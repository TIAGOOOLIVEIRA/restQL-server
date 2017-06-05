/**
 * Every action related to the environment
 * operations is centralized here.
 */

// Redux actions
import { ENVIRONMENT_ACTIONS } from '../reducers/environmentReducer';

import { loadTenants, loadResourcesFromTenant } from '../api/restQLAPI';

const store = require('../store/storeConfig').store;

export function handleActiveTenant(tenantKey) {
	const dispatch = store.dispatch;

	const tenants = store.getState().environmentReducer.tenants;
	
	dispatch({type: ENVIRONMENT_ACTIONS.SET_ACTIVE_TENANT, value: tenantKey});
	dispatch({type: ENVIRONMENT_ACTIONS.SET_TENANT, value: tenants[tenantKey]});

	handleLoadResources(null);
}

export function handleLoadTenants() {
  const dispatch = store.dispatch;

	loadTenants((result)=>{
		const tenants = (result.body ? result.body.tenants : []);

		if(!result.error && tenants.length > 0) {
			dispatch({type: ENVIRONMENT_ACTIONS.LOAD_TENANTS, value: tenants});
			dispatch({type: ENVIRONMENT_ACTIONS.SET_TENANT, value: tenants[0]})
		}
		else {
			dispatch({type: ENVIRONMENT_ACTIONS.LOAD_TENANTS, value: []});
		}
	});
}

export function handleSetTenant(evt) {

	const { tenants } = window.store.getState().environmentReducer;

	store.dispatch({type: ENVIRONMENT_ACTIONS.SET_ACTIVE_TENANT, value: evt.target.value});
	store.dispatch({type: ENVIRONMENT_ACTIONS.SET_TENANT, value: tenants[evt.target.value]});

	handleActiveTenant(evt.target.value);
}

export function handleLoadResources(evt) {
	const dispatch = store.dispatch;

	const tenant = store.getState().environmentReducer.tenant;

	dispatch({type: ENVIRONMENT_ACTIONS.CLEAR_RESOURCES});

	loadResourcesFromTenant(tenant, (result)=>{
		const resources = (result.body ? result.body.resources : []);
		dispatch({type: ENVIRONMENT_ACTIONS.LOAD_RESOURCES, value: resources});
	});
}
