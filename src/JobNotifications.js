import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen, faTrashCan, faCircleXmark, faFilePen } from '@fortawesome/free-solid-svg-icons';
import './JobNotifications.css';

const JobNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [newNotification, setNewNotification] = useState({
        company: '',
        category: '',
        date: '',
        eligibleBranches: '',
        eligibleCriteria: '',
        ctc: '',
        website: '',
        jobLocation: '',
        description: '',
        id: null, // Track the notification being edited
    });
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Load notifications from localStorage on component mount
    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem('jobNotifications')) || [];
        setNotifications(storedNotifications);
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('jobNotifications', JSON.stringify(notifications));
    }, [notifications]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNotification(prev => ({...prev, [name]: value }));
    };

    // Handle form submission (add or update notifications)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if mandatory fields are filled
        if (newNotification.company && newNotification.category) {
            if (newNotification.id) {
                // Update existing notification
                setNotifications(prev => prev.map(notification =>
                    notification.id === newNotification.id ? newNotification : notification
                ));
            } else {
                // Add a new notification
                setNotifications(prev => [
                    ...prev,
                    {...newNotification, id: Date.now() },
                ]);
            }

            // Reset the form and close the modal
            resetForm();
            setShowModal(false);
        }
    };

    // Reset the form fields
    const resetForm = () => {
        setNewNotification({
            company: '',
            category: '',
            date: '',
            eligibleBranches: '',
            eligibleCriteria: '',
            ctc: '',
            website: '',
            jobLocation: '',
            description: '',
            id: null, // Reset the id for new entries
        });
    };

    // Open the modal to view notification details
    const handleCardClick = (notification) => {
        setSelectedNotification(notification);
        setShowDetailModal(true);
    };

    // Remove notification from the list
    const handleRemoveNotification = (id, e) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    // Edit an existing notification
    const handleEditNotification = (notification, e) => {
        e.stopPropagation();
        setNewNotification(notification);
        setShowModal(true);
    };

    // Close detail view modal
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedNotification(null);
    };

    // Close the upload modal
    const closeUploadModal = () => {
        setShowModal(false);
    };

    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const upcomingNotifications = notifications.filter(notification => notification.date >= today);
    const completedNotifications = notifications.filter(notification => notification.date < today);

    return ( <
        div className = "job-notifications" >
        <
        h1 > Job Notifications < /h1>

        { /* Upload new notification button */ } <
        div className = "upload-button-wrapper" >
        <
        button className = "upload-button_1"
        onClick = {
            () => setShowModal(true) } >
        <
        FontAwesomeIcon icon = { faSquarePen }
        /> <
        /button> <
        /div>

        { /* Upcoming Notifications */ } <
        h3 > Upcoming Notifications: < /h3> <
        div className = "cards-container" > {
            upcomingNotifications.map(notification => ( <
                div key = { notification.id }
                className = "job-card"
                onClick = {
                    () => handleCardClick(notification) } >
                <
                div className = "action-buttons" >
                <
                button className = "edit-button"
                onClick = {
                    (e) => handleEditNotification(notification, e) } >
                <
                FontAwesomeIcon icon = { faFilePen }
                /> <
                /button> <
                button className = "remove-buttonn"
                onClick = {
                    (e) => handleRemoveNotification(notification.id, e) } >
                <
                FontAwesomeIcon icon = { faTrashCan }
                /> <
                /button> <
                /div> <
                h3 > { notification.company } < /h3> <
                p className = "even" > Date of Visit: { notification.date } < /p> <
                p className = "even" > Category: { notification.category } < /p> <
                /div>
            ))
        } <
        /div>

        { /* Completed Notifications */ } <
        h3 > Completed Notifications: < /h3> <
        div className = "cards-container" > {
            completedNotifications.map(notification => ( <
                div key = { notification.id }
                className = "job-card"
                onClick = {
                    () => handleCardClick(notification) } >
                <
                div className = "action-buttons" >
                <
                button className = "edit-button"
                onClick = {
                    (e) => handleEditNotification(notification, e) } >
                <
                FontAwesomeIcon icon = { faFilePen }
                /> <
                /button> <
                button className = "remove-buttonn"
                onClick = {
                    (e) => handleRemoveNotification(notification.id, e) } >
                <
                FontAwesomeIcon icon = { faTrashCan }
                /> <
                /button> <
                /div> <
                h3 > { notification.company } < /h3> <
                p > Date of Visit: { notification.date } < /p> <
                p > Category: { notification.category } < /p> <
                /div>
            ))
        } <
        /div>

        { /* Upload/Edit Notification Modal */ } {
            showModal && ( <
                div className = "modal" >
                <
                div className = "modal-content" >
                <
                FontAwesomeIcon icon = { faCircleXmark }
                onClick = { closeUploadModal }
                className = "close-icon" /
                >
                <
                h2 > { newNotification.id ? 'Edit' : 'Upload' }
                Job Notification < /h2> <
                form onSubmit = { handleSubmit } >
                <
                label >
                Company:
                <
                input type = "text"
                name = "company"
                value = { newNotification.company }
                onChange = { handleInputChange }
                required placeholder = "Enter company name" /
                >
                <
                /label> <
                label >
                Category:
                <
                input type = "text"
                name = "category"
                value = { newNotification.category }
                onChange = { handleInputChange }
                required placeholder = "Enter job category" /
                >
                <
                /label> <
                label >
                Date of Visit:
                <
                input type = "date"
                name = "date"
                value = { newNotification.date }
                onChange = { handleInputChange }
                required /
                >
                <
                /label> <
                label >
                Eligible Branches:
                <
                input type = "text"
                name = "eligibleBranches"
                value = { newNotification.eligibleBranches }
                onChange = { handleInputChange }
                required placeholder = "Enter eligible branches" /
                >
                <
                /label> <
                label >
                Eligible Criteria:
                <
                input type = "text"
                name = "eligibleCriteria"
                value = { newNotification.eligibleCriteria }
                onChange = { handleInputChange }
                required placeholder = "Enter eligible criteria" /
                >
                <
                /label> <
                label >
                CTC:
                <
                input type = "text"
                name = "ctc"
                value = { newNotification.ctc }
                onChange = { handleInputChange }
                required placeholder = "Enter CTC" /
                >
                <
                /label> <
                label >
                Website:
                <
                input type = "url"
                name = "website"
                value = { newNotification.website }
                onChange = { handleInputChange }
                placeholder = "Enter company website" /
                >
                <
                /label> <
                label >
                Job Location:
                <
                input type = "text"
                name = "jobLocation"
                value = { newNotification.jobLocation }
                onChange = { handleInputChange }
                required placeholder = "Enter job location" /
                >
                <
                /label> <
                label >
                Description:
                <
                textarea name = "description"
                value = { newNotification.description }
                onChange = { handleInputChange }
                required placeholder = "Enter job description" /
                >
                <
                /label> <
                button type = "submit"
                className = "close-button_1" > { newNotification.id ? 'Save Changes' : 'Upload' } <
                /button> <
                /form> <
                /div> <
                /div>
            )
        }

        { /* Notification Detail Modal */ } {
            showDetailModal && selectedNotification && ( <
                div className = "modal" >
                <
                div className = "modal-content" >
                <
                FontAwesomeIcon icon = { faCircleXmark }
                onClick = { closeDetailModal }
                className = "close-icon" /
                >
                <
                h2 > { selectedNotification.company } < /h2> <
                p > < strong > Category: < /strong> {selectedNotification.category}</p >
                <
                p > < strong > Date of Visit: < /strong> {selectedNotification.date}</p >
                <
                p > < strong > Eligible Branches: < /strong> {selectedNotification.eligibleBranches}</p >
                <
                p > < strong > Eligible Criteria: < /strong> {selectedNotification.eligibleCriteria}</p >
                <
                p > < strong > CTC: < /strong> {selectedNotification.ctc}</p >
                <
                p > < strong > Website: < /strong> <a href={selectedNotification.website} target="_blank" rel="noopener noreferrer">Visit Website</a > < /p> <
                p > < strong > Job Location: < /strong> {selectedNotification.jobLocation}</p >
                <
                p > < strong > Description: < /strong> {selectedNotification.description}</p >
                <
                /div> <
                /div>
            )
        } <
        /div>
    );
};

export default JobNotifications;