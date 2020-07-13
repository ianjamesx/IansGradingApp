import * as db from '../../db/dbquery';
import { Assignment, DBResult } from './Assignment';
import { keys, id, key } from '../../utils/utils';

let tablename: string = 'assignments';

let load = async (assign: Assignment): Promise<DBResult> => {
    return await db.load(assign, tablename);
};

let save = async (assign: Assignment): Promise<DBResult> => {
    return await db.save(assign, tablename);
};

let generateID = async (): Promise<number> => {
    return await db.generateID(tablename);
};

export {
    load,
    save,
    generateID
}