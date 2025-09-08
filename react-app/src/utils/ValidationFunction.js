function inputIsValid(value) {
    // special characters
    const regex = /[^A-Za-z0-9 ]/; // https://www.geeksforgeeks.org/javascript-program-to-check-if-a-string-contains-any-special-character/
    if(regex.test(value)) {
        return false;
    }

    // SQL keywords
    const sqlKeywords = ["ADD ","ALL ","ALTER ", "AND ", "ANY ", "AS ", "ASC ",
        "BACKUP ", "BETWEEN ",
        "CASE ", "CHECK ", "COLUMN ", "CONSTRAINT ", "CREATE ",
        "DATABASE ", "DEFAULT ", "DESC ", "DISTINCT ", "DROP ",
        "EXEC ", "EXISTS ",
        "FROM ", "GROUP BY ", "HAVING ",
        "IN ", "INDEX ", "INSERT ", "IS ",
        "JOIN ", " JOIN ",
        " KEY",
        "LIKE ", "LIMIT ",
        "NOT ", " NULL ",
        "OR ", "ORDER BY ",
        "PROCEDURE ",
        "ROWNUM ",
        "SELECT ", "SET ",
        "TABLE ", "TOP ", "TRUNCATE TABLE ",
        "UNION ", "UNIQUE ", "UPDATE ",
        "VALUES ", "VIEW ",
        "WHERE ", "DELETE "];

    for(let i = 0; i < sqlKeywords.length; i++) {
        if(value.toUpperCase().includes(sqlKeywords[i])) {
            return false;
        }
    }

    return true;
}

function inputIsValidForSelection(value) {
    // special characters
    const regex = /[^A-Za-z0-9=<>#! ]/; // https://www.geeksforgeeks.org/javascript-program-to-check-if-a-string-contains-any-special-character/
    if(regex.test(value)) {
        return false;
    }

    // SQL keywords
    const sqlKeywords = ["ADD ","ALL ","ALTER ", "ANY ", "AS ", "ASC ",
        "BACKUP ", "BETWEEN ",
        "CASE ", "CHECK ", "COLUMN ", "CONSTRAINT ", "CREATE ",
        "DATABASE ", "DEFAULT ", "DESC ", "DISTINCT ", "DROP ",
        "EXEC ", "EXISTS ",
        "FROM ", "GROUP BY ", "HAVING ",
        "IN ", "INDEX ", "INSERT ", "IS ",
        "JOIN ", " JOIN ",
        " KEY",
        "LIKE ", "LIMIT ",
        "NOT ", " NULL ",
        "ORDER BY ",
        "PROCEDURE ",
        "ROWNUM ",
        "SELECT ", "SET ",
        "TABLE ", "TOP ", "TRUNCATE TABLE ",
        "UNION ", "UNIQUE ", "UPDATE ",
        "VALUES ", "VIEW ",
        "WHERE ", "DELETE "];

    for(let i = 0; i < sqlKeywords.length; i++) {
        if(value.toUpperCase().includes(sqlKeywords[i])) {
            return false;
        }
    }



    return true;
}

export {
    inputIsValid,
    inputIsValidForSelection
};