import { beans } from '../../../entities/bean/index.js'
import { AddToCartButton } from '../../../features/cart/index.js'
import { FavoriteButton } from '../../../features/favorites/index.js'
import NotFound from '../../../shared/ui/NotFound.jsx'
import Tabs from '../../../shared/ui/Tabs.jsx'
import { brewMethods } from '../config/brewMethods.js'
import { reviews } from '../model/reviews.js'
import BrewGuide from './BrewGuide.jsx'
import ProductCard from './ProductCard.jsx'
import RelatedProducts from './RelatedProducts.jsx'
import ReviewList from './ReviewList.jsx'

export default function BeanPage({ beanId }) {
  const bean = beans.find((item) => item.id === beanId)
  if (!bean) return <NotFound />

  const beanReviews = reviews.filter((review) => review.beanId === bean.id)
  const related = beans.filter((item) => item.id !== bean.id)

  return (
    <>
      <ProductCard
        product={bean}
        favoriteButton={
          <FavoriteButton productId={bean.id} name={bean.name} />
        }
        addToCartButton={<AddToCartButton bean={bean} />}
      />
      <Tabs defaultValue="brew">
        <Tabs.List aria-label="Про каву">
          <Tabs.Tab value="brew">Заварювання</Tabs.Tab>
          <Tabs.Tab value="reviews">Відгуки ({beanReviews.length})</Tabs.Tab>
          <Tabs.Tab value="related">Схожі товари</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="brew">
          <BrewGuide methods={brewMethods} />
        </Tabs.Panel>
        <Tabs.Panel value="reviews">
          <ReviewList reviews={beanReviews} />
        </Tabs.Panel>
        <Tabs.Panel value="related">
          <RelatedProducts
            products={related}
            renderCardActions={(item) => (
              <FavoriteButton productId={item.id} name={item.name} />
            )}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}