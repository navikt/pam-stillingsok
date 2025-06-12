"use client";

export default function ErrorButton() {
    const throwError = () => {
        throw new Error("Test error from button click");
    };

    return <button onClick={throwError}>Click to throw an error</button>;
}
