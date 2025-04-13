export const generateUserCode = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join("");
    
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    const userCode = `${initials}${randomNumber}`;
    return userCode;
}
