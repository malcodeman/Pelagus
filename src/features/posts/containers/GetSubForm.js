import React, { Component } from "react";
import { withFormik, Form, Field } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import styled from "styled-components";

import Loader from "../../loader/components/Loader";

import { searchPosts } from "../actions/postsActions";

const StyledForm = styled(Form)`
  display: flex;
  margin: 0 auto;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled(Field)`
  color: #3a3133;
  height: 36px;
  font-size: 0.8rem;
  padding: 0 4px;
  outline: 0;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 2px;
  margin-right: 4px;
`;

const Button = styled.button`
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: 0;
  cursor: pointer;
  height: 36px;
  border-radius: 2px;
  font-size: 0.8rem;
  padding: 0 6px;
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #b00e23;
`;

class FormikForm extends Component {
  componentWillUnmount = () => {
    const { setSubmitting } = this.props;
    setSubmitting(false);
  };
  render() {
    const { errors, touched, isSubmitting } = this.props;
    return (
      <StyledForm>
        <FormItem>
          <Input type="text" name="subreddit" placeholder="Subreddit" />
          {touched.subreddit && errors.subreddit && (
            <ErrorMessage>{errors.subreddit}</ErrorMessage>
          )}
        </FormItem>
        <Button disabled={isSubmitting}>
          {isSubmitting ? <Loader /> : "Search"}
        </Button>
      </StyledForm>
    );
  }
}

const GetSubForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    subreddit: props.subreddit || "",
    sort: props.sort || null,
    time: props.time || null
  }),
  validationSchema: Yup.object().shape({
    subreddit: Yup.string().required("Subreddit is required")
  }),
  handleSubmit(payload, bag) {
    bag.props.searchPosts(
      payload.subreddit,
      payload.sort,
      payload.time,
      bag.setSubmitting
    );
  }
})(FormikForm);

const mapStateToProps = state => {
  return {
    sort: state.posts.sort,
    time: state.posts.time
  };
};

export default connect(
  mapStateToProps,
  { searchPosts }
)(GetSubForm);