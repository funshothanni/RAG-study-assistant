"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
    type Message = {
        role: "user" | "assistant";
        text: string;
    };
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        if (question.trim() === "") {
            return;
        }

        const currentQuestion = question;

        const newMessage: Message = {
            role: "user",
            text: currentQuestion
        };

        setMessages((previousMessages) => [
            ...previousMessages,
            newMessage
        ]);

        setQuestion("");

        const response = await fetch("/api/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: currentQuestion
            })
        });

        const data = await response.json();

        const assistantMessage: Message = {
            role: "assistant",
            text: data.answer
        };

        setMessages((previousMessages) => [
            ...previousMessages,
            assistantMessage
        ]);
    }
    function handleFileUpload(){
      if(!file){
          return;
      }
      setUploadedFile(file);
    }
    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <h1>RAG Study Assistant</h1>
                <p>Ask questions about course notes</p>

                <div className={styles.chat}>
                    <div className={styles.messages}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={
                                    message.role === "user"
                                        ? styles.userMessage
                                        : styles.assistantMessage
                                }
                            >
                                {message.text}
                            </div>
                        ))}

                    </div>

                    <form className={styles.form}
                    onSubmit={handleSubmit}>
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
                <div className={styles.uploadSection}>
                    <input
                        className={styles.fileInput}
                        type="file"
                        accept= ".pdf"
                        onChange={(event) => {
                            if (event.target.files) {
                                setFile(event.target.files[0]);
                            }
                        }}
                    />

                    <button
                        className={styles.uploadButton}
                        type="button"
                     onClick={handleFileUpload}>
                        Upload File
                    </button>
                    {uploadedFile && (
                        <p
                        className={styles.uploadedFile}>Uploaded: {uploadedFile.name}</p>
                    )}
                </div>
            </div>
        </main>
    );
}