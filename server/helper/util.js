/**
 * 
 * @param {*} id1 
 * @param {*} id2
 * Takes in two objectIDs in any order and sorts them.
 * This function helps ensure that conversations between two users 
 * always have the same roomID. 
 */
export const generateRoomID = (id1, id2) => {
    const mixed = (id1 + id2).split('');
    mixed.sort((a, b) => a.localeCompare(b));
    return mixed.join('');
}