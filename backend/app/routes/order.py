from fastapi import APIRouter,Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.order import Order



router=APIRouter(

prefix="/order",

tags=["Order"]

)



@router.post("/checkout")

def checkout(

user_id:int,

total_price:float,

db:Session=Depends(get_db)

):


    order=Order(

        user_id=user_id,

        total_price=total_price

    )


    db.add(order)

    db.commit()


    db.refresh(order)


    return {

        "message":"Order placed",

        "order_id":order.id

    }

@router.get("/history/{user_id}")
def order_history(

    user_id:int,

    db:Session=Depends(get_db)

):


    orders = db.query(Order).filter(

        Order.user_id == user_id

    ).all()



    order_list=[]


    for order in orders:


        order_list.append({

            "order_id": order.id,

            "total_price": float(order.total_price),

            "status": order.status,

            "date": order.created_at

        })


    return {

        "orders": order_list

    }