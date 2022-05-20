import {loadLists} from './lists'
import {loadProcesses} from './processes'
import {loadUsers} from './users'
import {loadTeams} from './teams'
import {loadIps} from './authorized'



export function clearData (dispatch) {
    dispatch(loadLists([]))
    dispatch(loadProcesses([]))
    dispatch(loadUsers([]))
    dispatch(loadTeams([]))
    dispatch(loadIps([]))
}