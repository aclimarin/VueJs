var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image">
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>

            <p :style="{ textDecoration: textStockDecoratio() }">Out of Stock</p>

            <info-tab :shipping="shipping" :details="details"></info-tab>

            <div v-for="(variant, index) in variants" 
                :key="variant.varianId"
                class="color-box"
                :style="{ backgroundColor:  variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>

            <button @click="addToCart" 
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }">
                Add to Cart
            </button>
            
            <button 
                class="canceldButton" 
                @click="removeFromCart">Remove</button>

            </divc>
        </div>

        <product-tabs :reviews="reviews"></product-tabs>
    </div>
    `,
    data() {
        return{
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "#42AE7B",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "#3C526C",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 5
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
            if (this.cart > 0)
                this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },        
        textStockDecoratio() {
            if (this.inStock)
                return "line-through"
            else
                return "none"
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium)
                return "Free"
            else
                return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="name" placeholder="name">
        </p>

        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        
        <p>
            <label>Would you recommend this product?</label>
            <p>
                <input type="radio" value="Yes" v-model="recommend">Yes
                <input type="radio" value="No" v-model="recommend">No
            </p>
        </p>
        
        <p>
            <input type="submit" value="Submit">  
        </p>  
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []

            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation required.")
            }
        },        
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
        <ul>
            <span class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
            >{{ tab }}</span>
        </ul>
        
        <div v-show="selectedTab === 'Reviews'"> 
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                    <p>{{ review.name }}</p>
                    <p>Rating:{{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        
        <div v-show="selectedTab === 'Make a Review'"> 
            <product-review></product-review>        
        </div>

    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('info-tab', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>

        <ul>
            <span class="tab" 
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            @click="selectedTab = tab"
            :key="tab"
        >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'"> 
            <p>Shipping: {{ shipping }}
        </div>

        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    </div>
    
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }


})

var app = new Vue({
    el: '#app',
    data: {
        premiumUser: true,
        cart: []
    },
    methods: {
        addItem(id){
            this.cart.push(id)
        },
        removeItem(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        },
        emptyCart() {
            if (this.cart.length <= 0)
                return true
            else
                return false
        },
    }
})
Vue.config.devtools = true