import { Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import React, { useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { usePopup } from '../Public/Popup'
import NavbarContext from '../Context/NavbarContext'

function Counter(props) {
  const navigate = useNavigate()
  const [count, setCount] = useState(1)
  // const [isCart, setIsCart] = useState(false)
  const { myAuth } = useContext(AuthContext)
  const { getcartlistnumber } = useContext(NavbarContext)
  const { Popup, openPopup, closePopup } = usePopup()
  useEffect(() => {
    setCount(1)
  }, [props.productId])

  function handlePlusClick() {
    setCount(count + 1)
  }

  function handleMinusClick() {
    if (count > 1) {
      setCount(count - 1)
    }
  }
  // let isCart = false
  function settomember() {
    fetch(`http://localhost:3008/member/logincart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: props.productId,
        amount: count,
        mid: myAuth.sid,
      }),
    }).then(() => {
      console.log('加入資料庫')
      openPopup()
      getcartlistnumber()
    })
  }

  const handleClosePopup = () => {
    closePopup()
    setCount(1)
  }

  // useEffect(() => {
  //   if (isCart === true) {
  //     setCount(1)
  //     setIsCart(false)
  //   }
  // }, [isCart])

  function nologin() {
    const cartItem = {
      productId: props.productId,
      amount: count,
    }

    localStorage.setItem('cart', JSON.stringify(cartItem))
    localStorage.setItem(
      'presentURL',
      'http://localhost:3002/product/productdetail'
    )
    navigate('/member/login', {
      state: {
        productId: props.productId,
        amount: count,
      },
    })
  }
  function settomembertocart() {
    // const cartItem = {
    //   productId: props.productId,
    //   amount: count,
    // }
    fetch(`http://localhost:3008/member/logincart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: props.productId,
        amount: count,
        mid: myAuth.sid,
      }),
    })
      .then((response) => {
        console.log('直接購買')
        navigate('/cart')
      })
      .catch((error) => {
        console.log(error)
      })
  }
  function nologintocart() {
    const cartItem = {
      productId: props.productId,
      amount: count,
    }

    localStorage.setItem('cart', JSON.stringify(cartItem))
    localStorage.setItem('presentURL', '"http://localhost:3002/cart"')
    navigate('/member/login', {
      state: {
        productId: props.productId,
        amount: count,
      },
    })
  }

  return (
    <>
      <Popup
        content={`已成功將\n${props.productCh}\n共${count}件加入購物車`
          .replace(/<br>/g, '\n')
          .replace(/<\/?[^>]+>/gi, '')}
        btnGroup={[{ text: '我要繼續買!', handle: handleClosePopup }]}
        icon={<i className="fa-solid fa-circle-check"></i>}
      />

      <div className="row justify-content-center text-align-center justify-content-md-start  mt-4 row-cols-1  row-cols-md-2">
        <div className="col pe-auto pe-md-4">
          <div className="row justify-content-center">
            <div className="col-3">
              <button
                className="g-line-btn j-h3 minus w-100"
                onClick={handleMinusClick}
              >
                <i className="fa-solid fa-minus "></i>
              </button>
            </div>
            <div className="col-6 px-0">
              <input
                type="text"
                className="j-h3 g-line-input text-align-center product-amount input-text w-100"
                value={count}
                readOnly
              />
            </div>
            <div className="col-3">
              <button
                className="g-line-btn me-0 me-md-2 j-h3 plus  w-100"
                onClick={handlePlusClick}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6 col-xl px-auto pe-auto pe-md-0 px-xl-0 pe-lg-auto mt-3 mt-md-0">
          <div className="row mt-xl-0 ">
            <div className="col px-xl-1">
              <button
                className="o-line-btn j-h3 d-md-block w-100 "
                onClick={() => {
                  if (myAuth.authorized) {
                    settomembertocart()
                  } else {
                    nologintocart()
                  }
                }}
              >
                立即購買
              </button>
            </div>
            <div className="col px-xl-0">
              <button
                className="cart-btn j-h3 w-100"
                onClick={() => {
                  if (myAuth.authorized) {
                    settomember()
                  } else {
                    nologin()
                  }
                }}
              >
                加入購物車
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Counter
