import React, { useState, useEffect } from "react";
import Modal from "./components/CustomModal";
import axios from 'axios';

const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false
  });
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then(res => setTaskList(res.data))
      .catch(err => console.log(err));
  };

  const displayCompleted = status => {
    if (status) {
      setViewCompleted(true);
    } else {
      setViewCompleted(false);
    }
  };

  const renderTabList = () => {
    return (
      <div className="mt-4 mb-3 tab-list">
        <button
          onClick={() => displayCompleted(true)}
          className={`${viewCompleted ? "btn btn-secondary" : "btn"} m-1 square border border-info`}
        >
          Completed Tasks
        </button>
        <button
          onClick={() => displayCompleted(false)}
          className={`${!viewCompleted ? "btn btn-secondary" : "btn"} m-1 square border border-info`}
        >
          Incomplete Tasks
        </button>
      </div>
    );
  };

  const renderItems = () => {
    const newItems = taskList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
        >
          <strong className="text-uppercase text-info">
          {item.title}
          </strong>
          <p className="text-black-50">
          - {item.description}
          </p>
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary m-1 "
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="btn btn-danger m-1"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = item => {
    toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(res => refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(res => refreshList());
  };

  const handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    setModal(!modal);
  };

  const editItem = item => {
    setActiveItem(item);
    setModal(!modal);
  };

  return (
    <>
      <main className="content">
        <h1 className="text-black text-center my-4 bg-light">TODO v1.0</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-2">
              <div className="">
                <button onClick={createItem} className="btn btn-lg btn-success">
                  Add task
                </button>
              </div>
              {renderTabList()}
              <ul className="list-group list-group-flush">
                {renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {modal ? (
          <Modal
            activeItem={activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        ) : null}
      </main>
      <footer className="text-black text-uppercase text-center my-4 ">
        Copyright 2023  All rights reserved
      </footer>
    </>
  );
}

export default App;