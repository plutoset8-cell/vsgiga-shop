'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const CartContext = createContext<any>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])

  // 1. ЗАГРУЗКА: Из реальной базы Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка загрузки из Supabase:', error.message)
    } else {
      setProducts(data || [])
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // 2. ДОБАВЛЕНИЕ В БАЗУ (Админ-панель)
  const addProductToShop = async (newProduct: any) => {
    const { id, ...productData } = newProduct 
    const { error } = await supabase
      .from('products')
      .insert([productData])
    
    if (error) {
      console.error('Ошибка добавления:', error.message)
      alert('Не удалось сохранить в базу!')
    } else {
      fetchProducts()
    }
  }

  // 3. УДАЛЕНИЕ ИЗ БАЗЫ (Админ-панель)
  const deleteProductFromShop = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Ошибка удаления:', error.message)
      alert('Не удалось удалить из базы!')
    } else {
      setProducts((prev) => prev.filter(product => product.id !== id))
    }
  }

  // --- ФУНКЦИИ КОРЗИНЫ (Исправленные под размеры и количество) ---

  const addToCart = (product: any) => {
    setCart((prev) => {
      // Ищем товар, у которого совпадает и ID, и РАЗМЕР
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      )
      
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Удаление теперь учитывает размер
  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)))
  }
  
  // ИСПРАВЛЕНО: Теперь принимает 3 аргумента, как в твоей корзине
  const updateQuantity = (id: string, size: string, amount: number) => {
    if (amount < 1) return
    setCart(prev => prev.map(item => 
      (item.id === id && item.selectedSize === size) 
        ? { ...item, quantity: amount } 
        : item
    ))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0)
  const totalPrice = cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0)

  return (
    <CartContext.Provider value={{ 
      products, 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      addProductToShop, 
      deleteProductFromShop, 
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) return { products: [], cart: [], totalItems: 0, totalPrice: 0 }
  return context
}