//interface for database query results
interface DBResult {
    error?: string;
    data?: any;
}

//interface for an API call
interface Result {
    error?: string | any;
    success?: any;
}
