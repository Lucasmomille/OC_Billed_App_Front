/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from '../containers/Bills'
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    
    test("I click on icon eye to open modal bill", async() => {
      $.fn.modal = jest.fn()
      await waitFor(() => screen.getAllByTestId('icon-eye'));
      const allIconEye = screen.getAllByTestId('icon-eye');
      const firstIconEye = allIconEye[0];
      
      const billContainer = new Bills({document, onNavigate, store: null, localStorage: window.localStorage })
      
      const handleClickIconEyeTest = jest.fn((icon) => billContainer.handleClickIconEye(icon));
      firstIconEye.addEventListener('click', handleClickIconEyeTest(firstIconEye))

      userEvent.click(firstIconEye);
      expect(handleClickIconEyeTest).toHaveBeenCalled()
      expect(document.getElementById('modaleFile')).toBeTruthy()
    })

    test("I click on create a new bill btn and it redirect to newBill page", async() => {
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const newBillBtn = screen.getByTestId('btn-new-bill')

      const billContainer = new Bills({document, onNavigate, store: null, localStorage: window.localStorage })
      
      const handleClickNewBillTest = jest.fn(() => billContainer.handleClickNewBill())

      newBillBtn.addEventListener('click', handleClickNewBillTest)

      userEvent.click(newBillBtn)
      expect(handleClickNewBillTest).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId('form-new-bill'))
      const formNewBill = screen.getByTestId('form-new-bill')
      expect(formNewBill).toBeTruthy()
    })
    /* test("Then redirect to page new bill", () => {
    }) */
    /* test("get bill", () => {
      await waitFor(() => screen.getByTestId('btn-new-bill'))
    }) */
  })
})

describe("Given I am a user connected as Employee", () => {
  document.body.innerHTML = ''
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      document.body.innerHTML = BillsUI({ data: bills })
      await waitFor(() => screen.getByText('Mes notes de frais'))
      const contentPending  = await screen.getByText("encore")
      expect(contentPending).toBeTruthy()
      const contentPending1  = await screen.getByText("test1")
      expect(contentPending1).toBeTruthy()
      const contentPending2  = await screen.getByText("test3")
      expect(contentPending2).toBeTruthy()
    })
    describe("When a corrupted data happen", () => {
      beforeEach(() => {
        document.body.innerHTML = ''
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        
        //await waitFor(() => screen.getByText(/Erreur/))
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })

  })
})