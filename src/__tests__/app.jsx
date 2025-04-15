import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app.jsx'

test('complete form journey - happy path', async () => {
  render(<App />)

  // 1-2 - User is on the home page with title
  expect(
    screen.getByRole('heading', {name: /welcome home/i}),
  ).toBeInTheDocument()

  // 3-4 - User clicks on the form link
  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  // 5-6 - User is redirected to page 1 with title
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  // 7 - Go home link is present
  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()

  // 8-9 - User fills the food field
  const foodInput = screen.getByLabelText(/favorite food/i)
  expect(foodInput).toBeInTheDocument()
  userEvent.type(foodInput, 'Les pâtes')

  // 10-11 - User clicks on Next link
  const nextLink = screen.getByRole('link', {name: /next/i})
  expect(nextLink).toBeInTheDocument()
  userEvent.click(nextLink)

  // 12-13 - User is redirected to page 2 with title
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  // 14 - Go back link is present
  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()

  // 15-16 - User fills the drink field
  const drinkInput = screen.getByLabelText(/favorite drink/i)
  expect(drinkInput).toBeInTheDocument()
  userEvent.type(drinkInput, 'Bière')

  // 17-18 - User clicks on Review link
  const reviewLink = screen.getByRole('link', {name: /review/i})
  expect(reviewLink).toBeInTheDocument()
  userEvent.click(reviewLink)

  // 19-20 - User is redirected to confirm page with title
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  // 21 - Confirmation text is present
  expect(screen.getByText(/please confirm your choices/i)).toBeInTheDocument()

  // 22-23 - Food and drink choices are displayed correctly
  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('Les pâtes')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  // 24-25 - Go back link and Confirm button are present
  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: /confirm/i})
  expect(confirmButton).toBeInTheDocument()

  // 26 - User clicks on Confirm button
  userEvent.click(confirmButton)

  // 27-28 - User is redirected to success page with title
  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /congrats\. you did it\./i}),
    ).toBeInTheDocument()
  })

  // 29-30 - User clicks on Go home link
  const goHomeLink = screen.getByRole('link', {name: /go home/i})
  expect(goHomeLink).toBeInTheDocument()
  userEvent.click(goHomeLink)

  // 31-32 - User is redirected to home page with title
  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /welcome home/i}),
    ).toBeInTheDocument()
  })
})

test('form submission with empty fields - error path', async () => {
  render(<App />)

  // Navigate to the form
  userEvent.click(screen.getByRole('link', {name: /fill out the form/i}))

  // Skip filling the food field and go to next page
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })
  userEvent.click(screen.getByRole('link', {name: /next/i}))

  // Fill the drink field and go to confirm page
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })
  userEvent.type(screen.getByLabelText(/favorite drink/i), 'Bière')
  userEvent.click(screen.getByRole('link', {name: /review/i}))

  // Try to submit the form with empty food field
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })
  userEvent.click(screen.getByRole('button', {name: /confirm/i}))

  // Should be redirected to error page
  await waitFor(() => {
    expect(
      screen.getByText(/oh no\. there was an error\./i),
    ).toBeInTheDocument()
  })
  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()
})
