export function categoryIsValid(category: string) {
    const acceptedCategories = ["A", "P", "L", "D", "O"];
    if (!acceptedCategories.includes(category)) {
        return false;
    }
    return true;
}