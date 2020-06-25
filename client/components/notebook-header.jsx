import React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class NotebookHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { student: [] };
    this.getStudentData = this.getStudentData.bind(this);
  }

  getStudentData() {
    fetch('/api/students/1')
      .then(response => response.json())
      .then(data => {
        this.setState({ student: data });
      })
      .catch(err => console.error('getStudentData() fetch failed:', err));
  }

  componentDidMount() {
    this.getStudentData();
  }

  render() {
    const studentName = this.state.student.length === 0
      ? 'Student Name' : this.state.student[0].firstName;
    return (
      <header className="header-container">
        <div className="header-left-container">
          <Link to="/">
            <i className="fa fa-bars theme-green fa-2x header-hamburger-icon"></i>
          </Link>
        </div>
        <div className="header-center-container">
          <Button outline color="success" className="header-outline-button">New Note</Button>
        </div>
        <div className="header-right-container">
          <div className="header-search-block">
            <h5>Search</h5>
            <div className="header-search-deco"></div>
          </div>
          <p className="theme-green header-student-name">{studentName}</p>
        </div>
      </header>
    );
  }

}