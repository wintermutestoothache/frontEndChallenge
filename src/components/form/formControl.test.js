import React from 'react';
import { render, cleanup, fireEvent, wait } from 'react-testing-library';
import FormControl from './formControl';
import 'jest-dom/extend-expect';

afterEach(cleanup);

const testData = {
    "data": [
        {
            "display_name": "Benefits",
            "id": "benefits"
        },
        {
            "display_name": "Employment",
            "id": "employment"
        },
        {
            "display_name": "Healthcare",
            "id": "healthcare"
        },
        {
            "display_name": "Housing",
            "id": "housing"
        },
        {
            "display_name": "Legal",
            "id": "legal"
        }
    ]
};


test('component renders with correct amount of inputs and select options', () => {
  const mockProcessPostRequest = jest.fn();
  const { container} = render(
    <FormControl
      data={ testData.data }
      processPostRequst={ mockProcessPostRequest }
    />
  );
  expect(container.querySelectorAll('input').length).toEqual(4);
  expect(container.querySelectorAll('select').length).toEqual(1);
  expect(container.querySelectorAll('textarea').length).toEqual(1);

  expect(container.querySelectorAll('option').length).toEqual(6);
});


test('component inputs render on change events', () => {
  const mockProcessPostRequest = jest.fn();
  const { container, getByPlaceholderText, getByText } = render(
    <FormControl
      data={ testData.data }
      processPostRequst={ mockProcessPostRequest }
    />
  );
  const firstNameInput = getByPlaceholderText('First Name');
  expect(firstNameInput.value).toBe('');
  fireEvent.change(firstNameInput, {'target':{'value': 'firstName'}});
  expect(firstNameInput.value).toBe('firstName');

  const selectInputForm = getByText('Select Service Type');
  expect(selectInputForm.value).toEqual('');
  fireEvent.change(selectInputForm, {'target': {'value':'legal'}});
  expect(selectInputForm.value).toEqual('legal');
})

test('component calls processPostRequest correctly', async () => {
  const mockProcessPostRequest = jest.fn();
  const { container, getByPlaceholderText, getByText } = render(
    <FormControl
      data={ testData.data }
      processPostRequest={ mockProcessPostRequest }
    />
  );
  fireEvent.change(
    getByPlaceholderText('First Name'), {'target':{'value': 'testfirstname'}}
  );
  expect(getByPlaceholderText('First Name').value).toEqual('testfirstname');

  fireEvent.change(
    getByPlaceholderText('Last Name'), {'target': {'value': 'testLastName'}}
  );
  expect(getByPlaceholderText('Last Name').value).toEqual('testLastName');

  fireEvent.change(
    getByPlaceholderText('Email Address'), {'target': {'value': 'test@t.com'}}
  );
  expect(getByPlaceholderText('Email Address').value).toEqual('test@t.com');

  fireEvent.change(
    container.querySelector('select'), {'target': {'value': 'housing'}}
  );
  expect(container.querySelector('select').value).toBe('housing');

  fireEvent.change(
    container.querySelector('textarea'), {'target': {'value': 'stuff'}}
  );
  expect(container.querySelector('textarea').value).toBe('stuff');

  fireEvent.click(
    container.querySelector('input[type="checkbox"]')
  );
  expect(container.querySelector('input[type="checkbox"]').checked).toBeTruthy()

  fireEvent.click(container.querySelector('button'));

  expect(mockProcessPostRequest).toHaveBeenCalledTimes(1);

  const calledWith = mockProcessPostRequest.mock.calls[0][0];
  expect(
    calledWith.assistance_request.contact.first_name).toEqual('testfirstname')
  expect(
    calledWith.assistance_request.contact.last_name).toEqual('testLastName');
  expect(calledWith.assistance_request.service_type).toEqual('housing');
  expect(calledWith.assistance_request.description).toEqual('stuff');
})

test('component doesnt call processPostRequest when empty', () => {
  const mockProcessPostRequest = jest.fn();
  const { container, getByPlaceholderText, getByText } = render(
    <FormControl
      data={ testData.data }
      processPostRequst={ mockProcessPostRequest }
    />
  );
  fireEvent.click(container.querySelector('input[type="checkbox"]'));
  fireEvent.click(container.querySelector('input[type="checkbox"]'));
  expect(mockProcessPostRequest).toHaveBeenCalledTimes(0);

});

test('checkbox enables button', () => {
  const mockProcessPostRequest = jest.fn();
  const { container, getByPlaceholderText, getByText } = render(
    <FormControl
      data={ testData.data }
      processPostRequst={ mockProcessPostRequest }
    />
  );
  expect(getByText('Get Assistance').disabled).toBeTruthy()
  fireEvent.click(container.querySelector('input[type="checkbox"]'));
  expect(getByText('Get Assistance').disabled).not.toBeTruthy();

})

test('cannot click submit button when checkbox unchecked', () => {
  const mockProcessPostRequest = jest.fn();
  const { container, getByPlaceholderText, getByText } = render(
    <FormControl
      data={ testData.data }
      processPostRequst={ mockProcessPostRequest }
    />
  );
  expect(getByText('Get Assistance').disabled).toBe(true);
  fireEvent.click(container.querySelector('button'));
  expect(mockProcessPostRequest).toHaveBeenCalledTimes(0);

});
