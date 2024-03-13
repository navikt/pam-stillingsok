export default class ContactPersonData {
    #name;
    #title;
    #phone;
    #email;

    constructor(name, title, phone, email) {
        this.#name = name;
        this.#title = title;
        this.#phone = phone;
        this.#email = email;
    }

    static fromQuery(contactPersonData) {
        return new ContactPersonData(
            contactPersonData.name,
            contactPersonData.title,
            contactPersonData.phone,
            contactPersonData.email,
        );
    }
}
