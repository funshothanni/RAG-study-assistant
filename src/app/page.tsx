"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
    const [question, setQuestion] = useState("");
    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <h1>RAG Study Assistant</h1>
                <p>Ask questions about course notes</p>

                <div className={styles.chat}>
                    <div className={styles.messages}>
                    </div>

                    <form className={styles.form}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Ask a question..."
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                        />

                        <button
                            className={styles.button}
                            type="submit"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}