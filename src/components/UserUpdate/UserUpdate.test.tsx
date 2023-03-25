import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import UserUpdate from './UserUpdate';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          image: null,
          firstName: '',
          lastName: '',
          email: '',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: true,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationUserBelongsTo: null,
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variable: {
        firstName: '',
        lastName: '',
        email: '',
      },
    },
    result: {
      data: {
        users: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 5) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User Update', () => {
  const props = {
    key: '123',
    id: '1',
  };

  const formData = {
    firstName: 'Sumit',
    lastName: 'Maithani',
    email: 'sumit@gmail.com',
    file: new File(['hello'], 'hello.png', { type: 'image/png' }),
    selectedOption: 'admin',
    applangcode: 'en',
  };

  const formData2 = {
    firstName: 'Sumit',
    lastName: 'Maithani',
    email: 'sumit@gmail.com',
    file: new File(['hello'], 'hello.png', { type: 'image/png' }),
    selectedOption: 'Superadmin',
    applangcode: 'en',
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName
    );
    userEvent.type(screen.getByPlaceholderText(/Email/i), formData.email);
    userEvent.upload(screen.getByLabelText(/Display Image:/i), formData.file);
    userEvent.click(screen.getByLabelText(/User Type/i));
    await wait();
    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/First Name/i)).toHaveValue(
      formData.firstName
    );
    expect(screen.getByPlaceholderText(/Last Name/i)).toHaveValue(
      formData.lastName
    );
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue(formData.email);

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Display Image/i)).toBeInTheDocument();
  });

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByLabelText('Admin')).not.toBeChecked();
    // Check that the second radio button is not checked
    expect(screen.getByLabelText('Superadmin')).not.toBeChecked();
  });

  test('When the first radio button is clicked, the corresponding value should be stored in the state', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText('Admin'));
    expect(screen.getByLabelText('Admin')).toBeChecked();
    expect(screen.getByLabelText('Superadmin')).not.toBeChecked();
    expect(formData.selectedOption).toBe('admin');
  });

  test('When the second radio button is clicked, the corresponding value should be stored in the state', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText('Superadmin'));
    expect(screen.getByLabelText('Superadmin')).toBeChecked();
    expect(screen.getByLabelText('Admin')).not.toBeChecked();
    expect(formData2.selectedOption).toBe('Superadmin');
  });

  test('selecting a language updates the form state', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    const dropdown = screen.getByTestId('applangcode');
    expect(dropdown).toBeInTheDocument();

    // Select the first option in the dropdown
    userEvent.selectOptions(dropdown, 'en');

    // Check if state was updated
    expect(formData.applangcode).toBe('en');
  });
});
