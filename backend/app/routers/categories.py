from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.dependencies import get_current_user
from app.database import get_session
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post(
    "/",
    response_model=CategoryRead,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    payload: CategoryCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Category:
    existing = session.exec(
        select(Category).where(
            Category.user_id == current_user.id,
            Category.name == payload.name,
        )
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A category with this name already exists.",
        )

    category = Category(
        name=payload.name,
        user_id=current_user.id,
    )
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@router.get("/", response_model=list[CategoryRead])
def list_categories(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> list[Category]:
    categories = session.exec(
        select(Category)
        .where(Category.user_id == current_user.id)
        .order_by(Category.name)
    ).all()
    return categories

@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Category:
    category = session.get(Category, category_id)
    if not category or category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return category  # placeholder — we'll add the real update logic next step