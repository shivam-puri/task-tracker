import React, { useState, useEffect } from 'react'
import Modal from './Modal';
import TaskColumn from './TaskColumn';
import CreateTask from './CreateTask';
import TaskDetails from './TaskDetails';
import moment from 'moment';
import { demotasks } from '../demotasks/DemoTasks';


const Tasks = () => {

    const [selectedTask, setSelectedTask] = useState(null);
    const [createTask, setCreateTask] = useState(false)
    const [editQuote, setEditQuote] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null);
    const [dropdown, setDropdown] = useState(false)

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setDropdown(!dropdown)
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    const [tasks, setTasks] = useState(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (!storedTasks) {
            localStorage.setItem('tasks', JSON.stringify(demotasks))
            return demotasks;
        }
        return JSON.parse(storedTasks);
    });

    const [quote, setQuote] = useState(() => {
        const storedQuote = localStorage.getItem('quote');
        return storedQuote ? JSON.parse(storedQuote) : "Double click to add your quote"
    })

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
        else {
            console.log("demo : ", demotasks)
            // If tasks do not exist, use the default set of tasks
            setTasks(demotasks);
            // Store default tasks in local storage for future use
            localStorage.setItem('tasks', JSON.stringify(demotasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);


    useEffect(() => {
        localStorage.setItem('quote', JSON.stringify(quote));
    }, [quote]);


    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        setSelectedTask(null)
    };


    const [priority_descending, set_priority_descending] = useState(false);
    const [priority_ascending, set_priority_ascending] = useState(false);
    const [start_date_ascending, set_start_date_ascending] = useState(false)
    const [start_date_descending, set_start_date_descending] = useState(false)


    const priorityValues = {
        "low": 1,
        "medium": 2,
        "high": 3
    };

    // Custom comparison function
    const compare_priority_descending = (task1, task2) => {
        const priorityValue1 = priorityValues[task1.priority];
        const priorityValue2 = priorityValues[task2.priority];

        // Compare tasks based on priority values
        return priorityValue2 - priorityValue1;
    };
    const compare_priority_ascending = (task1, task2) => {
        const priorityValue1 = priorityValues[task1.priority];
        const priorityValue2 = priorityValues[task2.priority];

        // Compare tasks based on priority values
        return priorityValue1 - priorityValue2;
    };

    const compare_start_date_ascending = (task1, task2) => {
        const startDate1 = moment(task1.start_date, 'MMMM Do YYYY')
        const startDate2 = moment(task2.start_date, 'MMMM Do YYYY')
        console.log(startDate1, startDate2)
        console.log(startDate1.isBefore(startDate2))
        if (startDate1.isBefore(startDate2)) {
            return -1; // task1 comes before task2
        } else if (startDate1.isAfter(startDate2)) {
            return 1; // task1 comes after task2
        } else {
            return 0; // dates are equal
        }
    }

    const compare_start_date_descending = (task1, task2) => {
        const startDate1 = moment(task1.start_date, 'MMMM Do YYYY')
        const startDate2 = moment(task2.start_date, 'MMMM Do YYYY')
        console.log(startDate1, startDate2)
        console.log(startDate1.isBefore(startDate2))
        if (startDate1.isAfter(startDate2)) {
            return -1; // task1 comes before task2
        } else if (startDate1.isAfter(startDate2)) {
            return 1; // task1 comes after task2
        } else {
            return 0; // dates are equal
        }
    }


    let sortedTasks = [...tasks];
    if (priority_descending) {
        sortedTasks = sortedTasks.sort(compare_priority_descending);
    }
    if (priority_ascending) {
        sortedTasks = sortedTasks.sort(compare_priority_ascending);
    }
    if (start_date_ascending) {
        sortedTasks = sortedTasks.sort(compare_start_date_ascending);
    }
    if (start_date_descending) {
        sortedTasks = sortedTasks.sort(compare_start_date_descending);
    }

    const resetSortingOptions = () => {
        set_priority_descending(false);
        set_priority_ascending(false);
        set_start_date_ascending(false);
        set_start_date_descending(false);
    };


    return (

        <div className='flex flex-col box-border lg:px-20 py-10 h-full min-h-100 md:px-5 sm:px-5' >
            <div className='flex flex-row ' >
                {
                    !editQuote ? <p onDoubleClick={() => setEditQuote(true)} >{quote} <i class="fa-solid fa-i-cursor text-md ml-5 text-slate-500"></i></p> : (
                        <div className='flex w-full mb-5'>
                            <input className='flex flex-1 w-full bg-transparent border-b border-slate-700 outline-none focus:outline-none pb-2' defaultValue={quote} value={quote} onChange={(e) => setQuote(e.target.value)} />

                            <button onClick={() => setEditQuote(false)} ><i className='fa-solid fa-check ml-10 mr-4' ></i></button>
                        </div>
                    )
                }
            </div>

            <div className='flex w-full justify-end' >
                <div className="relative inline-block text-left">
                    <button onClick={() => setDropdown(!dropdown)} type="button" className="inline-flex justify-center items-center w-full text-xs text-slate-400 focus:outline-none outline-none" id="options-menu" aria-haspopup="true" aria-expanded="true">
                        <i class="fa-solid fa-sort"></i>&nbsp;sort
                    </button>

                    {/* Dropdown panel */}
                    {dropdown && (
                        <div className="origin-top-right absolute right-0 mt-2  rounded-md shadow-2xl bg-slate-800 min-w-36">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <input type="radio" id="priority-desc" name="sort" className="hidden" value="desc" checked={priority_descending} onChange={() => { set_priority_descending(true); set_priority_ascending(false); handleOptionClick("priority-desc"); set_start_date_descending(false); set_start_date_ascending(false); }} />
                                <label htmlFor="priority-desc" className="flex w-full px-4 py-2 text-xs text-align-left text-slate-300s hover:bg-gray-100 hover:text-gray-900" role="menuitem">priority hi-lo</label>

                                <input type="radio" id="priority-asc" name="sort" className="hidden" value="asc" checked={priority_ascending} onChange={() => { set_priority_descending(false); set_priority_ascending(true); handleOptionClick("priority-asc"); set_start_date_descending(false); set_start_date_ascending(false); }} />
                                <label htmlFor="priority-asc" className="flex w-full px-4 py-2 text-xs text-align-left text-slate-300s hover:bg-gray-100 hover:text-gray-900" role="menuitem">priority lo-hi</label>

                                <input type="radio" id="start-date-asc" name="sort" className="hidden" value="asc" checked={start_date_ascending} onChange={() => { set_start_date_descending(false); set_start_date_ascending(true); set_priority_descending(false); set_priority_ascending(false); handleOptionClick("start-date-asc"); }} />
                                <label htmlFor="start-date-asc" className="mt-2 flex w-full px-4 py-2 text-xs text-align-left text-slate-300s hover:bg-gray-100 hover:text-gray-900" role="menuitem">old_starts</label>

                                <input type="radio" id="start-date-desc" name="sort" className="hidden" value="desc" checked={start_date_descending} onChange={() => { set_start_date_descending(true); set_start_date_ascending(false); set_priority_descending(false); set_priority_ascending(false); handleOptionClick("start-date-desc"); }} />
                                <label htmlFor="start-date-desc" className="mb-3 flex w-full px-4 py-2 text-xs text-align-left text-slate-300s hover:bg-gray-100 hover:text-gray-900" role="menuitem">new_starts</label>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={resetSortingOptions} className='text-xs ml-4 text-slate-400' ><i class="fa-solid fa-arrow-rotate-right rotate-90"></i> reset</button>
            </div>

            <div className='flex mt-10 w-full justify-around overflow-x-auto pb-20 ' >

                <TaskColumn sortedTasks={sortedTasks} handleTaskClick={handleTaskClick} tasks={tasks} status={"pending"} />
                <TaskColumn sortedTasks={sortedTasks} handleTaskClick={handleTaskClick} tasks={tasks} status={"in progress"} />
                <TaskColumn sortedTasks={sortedTasks} handleTaskClick={handleTaskClick} tasks={tasks} status={"completed"} />
                <TaskColumn sortedTasks={sortedTasks} handleTaskClick={handleTaskClick} tasks={tasks} status={"deployed"} />
                <TaskColumn sortedTasks={sortedTasks} handleTaskClick={handleTaskClick} tasks={tasks} status={"deferred"} />

            </div>

            <button onClick={() => setCreateTask(true)} className='absolute bottom-20 right-20 z-10 border dark:border-slate-700 rounded-full text-xs  p-3 py-2 shadow-lg bg-slate-700' > + add_task</button>

            {/* Open Task Modal */}

            {selectedTask && (
                <Modal onClose={closeModal} >
                    {/* Modal Content */}
                    <TaskDetails tasks={tasks} setTasks={setTasks} selectedTask={selectedTask} handleDeleteTask={handleDeleteTask} setSelectedTask={setSelectedTask} />
                </Modal>
            )}

            {/* Create Task Modal */}
            {createTask && (
                <Modal onClose={() => setCreateTask(false)} >
                    <CreateTask tasks={tasks} setTasks={setTasks} setCreateTask={setCreateTask} />
                </Modal>
            )}

        </div>
    )
}

export default Tasks