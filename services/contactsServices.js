import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { func } from 'joi';
import exp from 'node:constants';

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
}

function writeContacts(contacts) {
    return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
    const contacts = await readContacts();

    return contacts;
}

async function getContactById(contactId) {
    const contacts = await readContacts();

    const contact = contacts.find((contact) => contact.id === contactId);
    if (typeof contact === "undefined") {
        return null;
    }

    return contact;
}

async function removeContact(contactId) {
    const contacts = await readContacts();
    const index = contacts.findIndex((contacts) => contacts.id === contactId)
    if (index === -1) {
        return null;
    }

    const removeContact = contacts[index];
    const newContacts = [...contacts.slise(0, index), ...contacts.slise(index + 1)];
    await writeContacts(newContacts);

    return removeContact;
}

async function addContact(name, email, phone) {
    const contact = await readContacts();

    const newContact = { id: crypto.randomUUID(), ...name, email, phone };
    contacts.push(newContact);

    await writeContacts(contacts);
    return newContact;
}

export default { listContacts, getContactById, removeContact, addContact}