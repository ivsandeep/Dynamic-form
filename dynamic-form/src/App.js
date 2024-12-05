// src/App.js
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DynamicForm from "./components/DynamicForm";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <DynamicForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
