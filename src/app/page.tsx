"use client";
import { Inter } from "next/font/google";
import { useState } from "react";
import styles from "./page.module.css";

const inter = Inter({
    subsets: ["latin"]
});
export default function Home() {
    type Message = {
        role: "user" | "assistant";
        text: string;
    };

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");

    const [showAddSubject, setShowAddSubject] = useState(false);
    const [newSubject, setNewSubject] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (selectedSubject === "") {
            alert("Please select a subject first.");
            return;
        }

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
                question: currentQuestion,
                subject: selectedSubject
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

    function handleAddSubject() {
        const subject = newSubject.trim().toUpperCase();

        if (!/^[A-Z]{4}$/.test(subject)) {
            alert("Subject must be exactly 4 letters.");
            return;
        }

        if (!subjects.includes(subject)) {
            setSubjects((previousSubjects) => [
                ...previousSubjects,
                subject
            ]);
        }

        setSelectedSubject(subject);
        setNewSubject("");
        setShowAddSubject(false);
    }

    async function handleFileUpload() {
        if (selectedSubject === "") {
            alert("Please select a subject first.");
            return;
        }

        if (!file) {
            alert("Please choose a PDF first.");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        formData.append("course", selectedSubject);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            console.error(data);
            alert(data.error || "File upload failed.");
            return;
        }

        setUploadedFile(file);

        alert("File uploaded successfully.");
    }

    return (
        <h1 className={`${styles.title} ${inter.className}`}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        <span className={styles.ragText}>RAG</span>
                        <span> Study Assistant</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Your course notes, ready to answer.
                    </p>
                </header>
                <div className={styles.subjectSection}>
                    <label className={styles.label}>
                        Subject
                    </label>

                    <select
                        className={styles.select}
                        value={selectedSubject}
                        onChange={(event) =>
                            setSelectedSubject(event.target.value)
                        }
                    >
                        <option value="">
                            Select subject
                        </option>

                        {subjects.map((subject) => (
                            <option
                                key={subject}
                                value={subject}
                            >
                                {subject}
                            </option>
                        ))}
                    </select>

                    <button
                        className={styles.addSubjectButton}
                        type="button"
                        onClick={() =>
                            setShowAddSubject(
                                !showAddSubject
                            )
                        }
                    >
                        Add Subject
                    </button>

                    {showAddSubject && (
                        <div className={styles.addSubjectBox}>
                            <input
                                className={styles.subjectInput}
                                type="text"
                                placeholder="e.g. COMP"
                                maxLength={4}
                                value={newSubject}
                                onChange={(event) =>
                                    setNewSubject(
                                        event.target.value.toUpperCase()
                                    )
                                }
                            />

                            <button
                                className={styles.saveSubjectButton}
                                type="button"
                                onClick={handleAddSubject}
                            >
                                Save Subject
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.uploadSection}>
                    <label className={styles.label}>
                        Upload Study Material
                    </label>

                    <div className={styles.filePicker}>
                        <label
                            htmlFor="pdfFile"
                            className={styles.chooseFileButton}
                        >
                            Choose File
                        </label>

                        <span className={styles.fileName}>
        {file ? file.name : "No file selected"}
    </span>

                        <input
                            id="pdfFile"
                            className={styles.hiddenFileInput}
                            type="file"
                            accept=".pdf"
                            onChange={(event) => {
                                if (
                                    event.target.files &&
                                    event.target.files.length > 0
                                ) {
                                    setFile(event.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    <button
                        className={styles.uploadButton}
                        type="button"
                        onClick={handleFileUpload}
                    >
                        Upload File
                    </button>

                    {uploadedFile && (
                        <p className={styles.uploadedFile}>
                            Uploaded: {uploadedFile.name}
                        </p>
                    )}
                </div>

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

                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Ask a question..."
                            value={question}
                            onChange={(event) =>
                                setQuestion(
                                    event.target.value
                                )
                            }
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
        </h1>
    );
}