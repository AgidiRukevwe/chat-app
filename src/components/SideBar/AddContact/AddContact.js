import { Modal, RootRef } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import db from "../../../firebase";
import { useStateValue } from "../../utilities/StateProvider";

function AddContact() {
    const [input, setInput] = useState("");
    const [list, setList] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [{ users }] = useStateValue();

    useEffect(() => {
        db.collection("users").onSnapshot((snapshot) => {
            setList(
                snapshot.docs.map((doc) => ({
                    items: doc.data().email
                }))
            );
        });
    });

    const onTextChange = (e) => {
        let suggestion = [];
        const value = e.target.value;
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, "i");
            // suggestion = list.sort().filter((v) => v.text(regex));
            suggestion = list.map((item) => {
                item.sort().filter((v) => v.test(regex));
            });
        }
        this.setSuggestions({ suggestion });
    };

    const renderSuggestions = () => {
        if (suggestions.length === 0) {
            return null;
        }
        suggestions.map((item) => (
            <ul>
                <li key={item.items}>{item.items}</li>
            </ul>
        ));
    };

    return (
        <div className="addContact">
            <input
                type="text"
                onChange={onTextChange}
                placeholder="Type in email"
            />
            {renderSuggestions}
        </div>
    );
}

export default AddContact;
