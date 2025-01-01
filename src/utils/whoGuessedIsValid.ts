export function whoGuessedIsValid(whoGuessed: string) {
    const acceptedTeams = ["A", "B"];
    if (!acceptedTeams.includes(whoGuessed)) {
        return false;
    }
    return true;
}