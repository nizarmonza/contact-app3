import './App.css';
import React, { useEffect, useState } from "react";
import Header from "./Header"
import AddContact from "./AddContact"
import ContactList from "./ContactList"
import { v4 as uuid } from "uuid";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ContactDetail from './ContactDetail';
import api from "../api/contacts"
import EditContact from './EditContact';


function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? []
  );

    //RetrieveContacts
    const retriveContacts = async () => {
      const response = await api.get("/contacts")
      return response.data
    }

  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact
    }

    const response = await api.post("/contacts", request)
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async(contact) => {
    const response = await api.put(`/contact/${contact.id}`, contact)
    const {id, name, email} = response.data;
    setContacts(contact.map((contact) => {
      return contacts.id === id ? {...response.data} : contact;
    }))

  }

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

   useEffect(() => {
  //   const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  //   if (retriveContacts) setContacts(retriveContacts);
  const getAllContacts = async () => {
    const allContacts = await retriveContacts();
    if(allContacts) setContacts(allContacts)
  }

  getAllContacts();
   }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ContactList contacts={contacts} getContactId={removeContactHandler} />} />
          <Route path="/add" element={<AddContact addContactHandler={addContactHandler} />} />
          <Route path='/contact/:id' element={<ContactDetail />} />  
          <Route
            path="/edit"
            element = {<EditContact updateContactHandler={updateContactHandler} />}
          />
        </Routes>
        {/*<AddContact addContactHandler={addContactHandler} />*/}
        {/*<ContactList contacts={contacts} getContactId={removeContactHandler} />*/}
      </Router>
    </div>
  );
}

export default App;
