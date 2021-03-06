import React, { Component } from 'react'
import { connect } from 'react-redux'
import PollNotFound from './PollNotFound'
import { handleAddAnswer } from '../actions/shared'

class AnswerPoll extends Component {
  state = {
    option: 'one',
    submitted: false,
  }

  handleChange = (e) => {
    this.setState({
      option: e.target.value
    })
  }

  handleSumbit = (e) => {
    e.preventDefault()
    const { handleAddAnswer, poll} = this.props
    const { option } = this.state
    let answer
    option === 'one'
    ? answer = 'optionOne'
    : answer = 'optionTwo'

  handleAddAnswer(poll.id, answer)
    ? this.setState({
      submitted: true
    })
    : alert('There was a problem submitting the form.')
  }

  render() {

    const { pollExists, poll, author, avatar, authedUser, answers } = this.props

    if (!pollExists) {
      return <PollNotFound />
    }

    return (
      !answers.includes(poll.id)
      ? <div className='answer-poll'>
          <h4 className='author'>{author} asks:</h4>
          <div className='detail-image'>
            <img
              className='detail-avatar'
              src={avatar}
              alt={`${author}`}
            />
          </div>
          <div className='detail-question-detail'>
            <h3>Would You Rather ...</h3>
            <form
              className='question-form'
              onSubmit={this.handleSumbit}
            >
              <div className='radios'>
                <label>
                  <input
                    className='radio'
                    type='radio'
                    checked={this.state.option === 'one'}
                    onChange={this.handleChange}
                    value='one'
                    id='optionOne'
                  />
                  {poll.optionOne.text}
                </label>
              </div>
              <div className='radios'>
                <label>
                  <input
                    className='radio'
                    type='radio'
                    checked={this.state.option === 'two'}
                    onChange={this.handleChange}
                    value='two'
                    id='optionTwo'
                  />
                  {poll.optionTwo.text}
                </label>
              </div>
              <button className='submit-poll'>
                Submit
              </button>
            </form>
          </div>
        </div>
      : <div className='show-results'>
          <h4 className='author'>Asked by {author}</h4>
          <div className='detail-image'>
            <img
              className='detail-avatar'
              src={avatar}
              alt={`${author}`}
            />
          </div>
          <div className='detail-question-detail'>
            <h3 className='header'>Results:</h3>
            <div className='option'>
            <h4
              className='option-text'
            >
              Would you rather {poll.optionOne.text}?
            </h4>
              {poll.optionOne.votes.includes(authedUser) &&
              <div className='vote'><span className='voteText'>Your Vote</span></div>}
              <div className='percentage'>
                {`${(poll.optionOne.votes.length / (poll.optionOne.votes.length + poll.optionTwo.votes.length) * 100).toFixed(0)}%`}
              </div>
              <div className='votes'>
              {poll.optionOne.votes.length > 0 && `${poll.optionOne.votes.length} out of ${poll.optionOne.votes.length + poll.optionTwo.votes.length} votes`}
              </div>
            </div>
            <div className='option'>
            <h4
              className='option-text'
            >
              Would you rather {poll.optionTwo.text}?
            </h4>
            {poll.optionTwo.votes.includes(authedUser) && <div className='vote'><span className='voteText'>Your Vote</span></div>}
              <div className='percentage'>
                {`${(poll.optionTwo.votes.length / (poll.optionOne.votes.length + poll.optionTwo.votes.length) * 100).toFixed(0)}%`}
              </div>
              <div className='votes'>
              {poll.optionTwo.votes.length > 0 && `${poll.optionTwo.votes.length} out of ${poll.optionOne.votes.length + poll.optionTwo.votes.length} votes`}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

function mapStateToProps({ polls, users, authedUser }, props) {
  const { question_id } = props.match.params
  const pollIds = Object.keys(polls)
  const pollExists = pollIds.includes(question_id)
  const poll = pollExists ? polls[question_id] : null
  const author = pollExists ? users[poll.author].name : null
  const avatar = pollExists ? users[poll.author].avatarURL : null
  const answers = Object.keys(users[authedUser].answers)

  return {
    pollExists,
    poll,
    author,
    avatar,
    authedUser,
    answers,
  }
}

export default connect(mapStateToProps, { handleAddAnswer })(AnswerPoll);
