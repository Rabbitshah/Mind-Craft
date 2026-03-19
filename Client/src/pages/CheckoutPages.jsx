import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  Button,
  ImageFallback,
  Input,
  Label,
  Separator,
  TabPanel,
  Tabs,
} from "../components/primitives";
import { Icon } from "../components/Icons";
import {
  applyPromoCode,
  checkout as checkoutRequest,
  getCart,
  getLatestOrder,
  removeFromCart,
} from "../api/commerceApi";

export function CheckoutCartPage() {
  const [cart, setCart] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCart() {
      try {
        setLoading(true);
        const data = await getCart();
        if (!ignore) {
          setCart(data.cart);
          setPromoCode(data.cart.promoCode || "");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleRemove(courseId) {
    const data = await removeFromCart(courseId);
    setCart(data.cart);
  }

  async function handleApplyPromo() {
    try {
      setPromoMessage("");
      const data = await applyPromoCode(promoCode);
      setCart(data.cart);
      setPromoCode(data.cart.promoCode || promoCode.toUpperCase());
      setPromoMessage(data.message);
    } catch (requestError) {
      setPromoMessage(requestError.message);
    }
  }

  if (loading) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--muted-foreground)]">Loading cart...</div></div>;
  }

  if (error || !cart) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--danger)]">{error || "Unable to load cart."}</div></div>;
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="page-section py-12">
        <h1 className="editorial-title text-5xl font-black">Shopping Cart</h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          {cart.items.length} courses in your cart
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white">
              {cart.items.map((item, index) => (
                <div key={item.courseId}>
                  <div className="grid gap-4 p-6 md:grid-cols-[160px,1fr,48px]">
                    <ImageFallback
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-24 w-full rounded-[1rem] object-cover"
                    />
                    <div>
                      <p className="text-lg font-bold">{item.title}</p>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        by {item.instructorName}
                      </p>
                      <div className="mt-4 flex items-end gap-3">
                        <span className="text-2xl font-black">${item.price}</span>
                        <span className="text-sm text-[var(--muted-foreground)] line-through">
                          ${item.originalPrice}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.courseId)}
                      className="text-[var(--danger)]"
                    >
                      <Icon name="trash" className="h-5 w-5" />
                    </button>
                  </div>
                  {index < cart.items.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <Icon name="tag" className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-lg font-bold">Have a promo code?</h2>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Enter promo code"
                />
                <Button variant="outline" onClick={handleApplyPromo}>Apply</Button>
              </div>
              {promoMessage ? (
                <p className={`mt-3 text-sm ${promoMessage.includes("invalid") ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
                  {promoMessage}
                </p>
              ) : null}
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-[var(--border)] bg-white p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Original Price</span>
                <strong>${cart.summary.originalTotal}</strong>
              </div>
              <div className="flex justify-between text-[var(--success)]">
                <span>Discount</span>
                <strong>-${cart.summary.discount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <strong>${cart.summary.tax.toFixed(2)}</strong>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-black text-[var(--primary)]">
                ${cart.summary.total.toFixed(2)}
              </span>
            </div>
            <Link to="/checkout/payment">
              <Button className="mt-6 w-full">
                Proceed to Checkout
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </Link>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    country: "",
    zip: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCart() {
      try {
        setLoading(true);
        const data = await getCart();
        if (!ignore) {
          setCart(data.cart);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCheckout(paymentMethod = "card") {
    try {
      setSubmitting(true);
      setError("");
      await checkoutRequest({
        paymentMethod,
        billingDetails: {
          name: card.name,
          country: card.country,
          zip: card.zip,
        },
      });
      navigate("/checkout/confirmation");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--muted-foreground)]">Loading checkout...</div></div>;
  }

  if (error && !cart) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--danger)]">{error}</div></div>;
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="page-section py-12">
        <h1 className="editorial-title text-5xl font-black">Complete Your Order</h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          Secure payment flow rebuilt without external UI primitives.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-[var(--success)] bg-[#daf6ed] p-4 text-[var(--success)]">
              <p className="font-semibold">Secure Checkout</p>
              <p className="text-sm">
                Your payment information is encrypted and secure.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
              <Tabs
                tabs={[
                  { value: "card", label: "Credit / Debit Card" },
                  { value: "paypal", label: "PayPal" },
                ]}
                defaultTab="card"
              >
                <TabPanel value="card">
                  <form
                    className="space-y-5"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      await handleCheckout("card");
                    }}
                  >
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        value={card.number}
                        onChange={(event) =>
                          setCard((current) => ({ ...current, number: event.target.value }))
                        }
                        className="mt-2"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        value={card.name}
                        onChange={(event) =>
                          setCard((current) => ({ ...current, name: event.target.value }))
                        }
                        className="mt-2"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="card-expiry">Expiry</Label>
                        <Input
                          id="card-expiry"
                          value={card.expiry}
                          onChange={(event) =>
                            setCard((current) => ({ ...current, expiry: event.target.value }))
                          }
                          className="mt-2"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input
                          id="card-cvv"
                          value={card.cvv}
                          onChange={(event) =>
                            setCard((current) => ({ ...current, cvv: event.target.value }))
                          }
                          className="mt-2"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="card-country">Country</Label>
                        <Input
                          id="card-country"
                          value={card.country}
                          onChange={(event) =>
                            setCard((current) => ({ ...current, country: event.target.value }))
                          }
                          className="mt-2"
                          placeholder="United States"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-zip">ZIP</Label>
                        <Input
                          id="card-zip"
                          value={card.zip}
                          onChange={(event) =>
                            setCard((current) => ({ ...current, zip: event.target.value }))
                          }
                          className="mt-2"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                    {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
                    <Button className="w-full" type="submit" disabled={submitting || !cart?.items.length}>
                      <Icon name="lock" className="h-5 w-5" />
                      {submitting ? "Processing..." : `Complete Purchase - $${cart?.summary.total.toFixed(2)}`}
                    </Button>
                  </form>
                </TabPanel>

                <TabPanel value="paypal">
                  <div className="py-8 text-center">
                    <p className="text-lg font-semibold">PayPal checkout flow</p>
                    <p className="mt-2 text-[var(--muted-foreground)]">
                      This phase uses a mock payment provider so the order flow can be completed end-to-end.
                    </p>
                    <Button className="mt-6" onClick={() => handleCheckout("paypal")} disabled={submitting || !cart?.items.length}>
                      Continue with PayPal
                    </Button>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-[var(--border)] bg-white p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {cart?.items.map((course) => (
                <div key={course.courseId} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-[var(--muted-foreground)]">by {course.instructorName}</p>
                  </div>
                  <strong>${course.price}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function CheckoutConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      try {
        setLoading(true);
        const data = await getLatestOrder();
        if (!ignore) {
          setOrder(data.order);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--muted-foreground)]">Loading order confirmation...</div></div>;
  }

  if (error || !order) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--danger)]">{error || "No recent order found."}</div></div>;
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="page-section py-12">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#daf6ed] text-[var(--success)]">
            <Icon name="check" className="h-12 w-12" />
          </div>
          <h1 className="editorial-title mt-6 text-5xl font-black">Payment Successful</h1>
          <p className="mt-3 text-lg text-[var(--muted-foreground)]">
            Your courses are now unlocked and ready to start.
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Order number: <strong className="text-[var(--foreground)]">{order.orderNumber}</strong>
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link to="/learn">
            <Button className="w-full">
              <Icon name="play" className="h-5 w-5" />
              Start Learning Now
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            <Icon name="download" className="h-5 w-5" />
            Download Receipt
          </Button>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <div className="mt-6 space-y-5">
            {order.items.map((course) => (
              <div key={course.courseId} className="grid gap-4 md:grid-cols-[160px,1fr,100px]">
                <ImageFallback
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-24 w-full rounded-[1rem] object-cover"
                />
                <div>
                  <p className="text-lg font-bold">{course.title}</p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    by {course.instructorName}
                  </p>
                </div>
                <p className="text-right text-xl font-black">${course.price}</p>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="ml-auto max-w-sm space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>${order.summary.subtotal.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <strong>${order.summary.tax.toFixed(2)}</strong>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total Paid</span>
              <strong className="text-[var(--primary)]">${order.summary.total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
