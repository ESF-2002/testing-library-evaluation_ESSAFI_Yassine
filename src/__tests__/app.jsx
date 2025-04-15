import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app.jsx'

test('cas passant', async () => {
  render(<App />)

  expect(
    screen.getByRole('heading', {name: /welcome home/i}),
  ).toBeInTheDocument()

  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()

  const foodInput = screen.getByLabelText(/favorite food/i)
  expect(foodInput).toBeInTheDocument()
  userEvent.type(foodInput, 'Les pâtes')

  const nextLink = screen.getByRole('link', {name: /next/i})
  expect(nextLink).toBeInTheDocument()
  userEvent.click(nextLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()

  const drinkInput = screen.getByLabelText(/favorite drink/i)
  expect(drinkInput).toBeInTheDocument()
  userEvent.type(drinkInput, 'Bière')

  const reviewLink = screen.getByRole('link', {name: /review/i})
  expect(reviewLink).toBeInTheDocument()
  userEvent.click(reviewLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  expect(screen.getByText(/please confirm your choices/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('Les pâtes')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: /confirm/i})
  expect(confirmButton).toBeInTheDocument()

  userEvent.click(confirmButton)

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /congrats\. you did it\./i}),
    ).toBeInTheDocument()
  })

  const goHomeLink = screen.getByRole('link', {name: /go home/i})
  expect(goHomeLink).toBeInTheDocument()
  userEvent.click(goHomeLink)

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /welcome home/i}),
    ).toBeInTheDocument()
  })
})

test('cas non passant', async () => {
  render(<App />)

  userEvent.click(screen.getByRole('link', {name: /fill out the form/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  userEvent.click(screen.getByRole('link', {name: /next/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  userEvent.type(screen.getByLabelText(/favorite drink/i), 'Bière')
  userEvent.click(screen.getByRole('link', {name: /review/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  userEvent.click(screen.getByRole('button', {name: /confirm/i}))

  await waitFor(() => {
    expect(
      screen.getByText(/oh no\. there was an error\./i),
    ).toBeInTheDocument()
  })
  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()

  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()
  expect(screen.getByRole('link', {name: /try again/i})).toBeInTheDocument()

  userEvent.click(screen.getByRole('link', {name: /try again/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })
})
