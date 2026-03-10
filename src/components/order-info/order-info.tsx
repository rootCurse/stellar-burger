import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.items);
  const userOrders = useSelector((state) => state.order.userOrders);
  const feedOrders = useSelector((state) => state.feed.orders);

  const orderData = useMemo(() => {
    const num = Number(number);
    return [...feedOrders, ...userOrders].find((o) => o.number === num) ?? null;
  }, [number, feedOrders, userOrders]);

  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const fetchedOrder = useSelector((state) => state.order.orderModalData);
  const resolvedOrder = orderData ?? fetchedOrder;

  const orderInfo = useMemo(() => {
    if (!resolvedOrder || !ingredients.length) return null;

    const date = new Date(resolvedOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = resolvedOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...resolvedOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [resolvedOrder, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
