import './App.css'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

const apiBaseUrl = 'https://localhost:7226'

type RegisteredUser = {
    userName: string
    normalizedUserName: string
    email: string
    normalizedEmail: string
    emailConfirmed: boolean
    passwordHash: string | null
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean
    accessFailedCount: number
    logins: Array<{ providerDisplayName: string }>
    firstName: string
    lastName: string
    profilePictureUrl: string | null
}

function UserPage() {
    const [user, setUser] = useState<RegisteredUser | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/auth/user`, {
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error(`The request failed (${response.status}).`)
                }

                setUser(await response.json() as RegisteredUser)
            } catch (requestError) {
                setError(requestError instanceof Error ? requestError.message : 'Unable to load user.')
            }
        }

        void loadUser()
    }, [])

    return (
        <main className="user-page">
            <h1>Registered user</h1>
            {error ? (
                <p role="alert">{error}</p>
            ) : user ? (
                <>
                    {user.profilePictureUrl && (
                        <img className="profile-picture" src={user.profilePictureUrl} alt="Profile" />
                    )}
                    <dl>
                        <dt>First name</dt>
                        <dd>{user.firstName}</dd>
                        <dt>Last name</dt>
                        <dd>{user.lastName}</dd>
                        <dt>Username</dt>
                        <dd>{user.userName}</dd>
                        <dt>Normalized username</dt>
                        <dd>{user.normalizedUserName}</dd>
                        <dt>Email</dt>
                        <dd>{user.email}</dd>
                        <dt>Normalized email</dt>
                        <dd>{user.normalizedEmail}</dd>
                        <dt>Email confirmed</dt>
                        <dd>{String(user.emailConfirmed)}</dd>
                        <dt>Has password</dt>
                        <dd>{String(user.passwordHash !== null)}</dd>
                        <dt>Phone number confirmed</dt>
                        <dd>{String(user.phoneNumberConfirmed)}</dd>
                        <dt>Two-factor authentication enabled</dt>
                        <dd>{String(user.twoFactorEnabled)}</dd>
                        <dt>Access failed count</dt>
                        <dd>{user.accessFailedCount}</dd>
                        <dt>Login providers</dt>
                        <dd>{user.logins.length ? user.logins.map((login) => login.providerDisplayName).join(', ') : 'None'}</dd>
                        <dt>Profile picture URL</dt>
                        <dd>{user.profilePictureUrl || 'None'}</dd>
                    </dl>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </main>
    )
}

function AddPasswordPage() {
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage('')
        setError('')
        setIsSubmitting(true)

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/add-password`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            })

            if (!response.ok) {
                throw new Error(`The request failed (${response.status}).`)
            }

            setPassword('')
            setMessage('Password added successfully.')
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to add password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="add-password-page">
            <h1>Add password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add password'}
                </button>
            </form>
            {message && <p>{message}</p>}
            {error && <p role="alert">{error}</p>}
        </main>
    )
}

function LoginPage() {
    const [email, setEmai] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage('')
        setError('')
        setIsSubmitting(true)

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                throw new Error(`The request failed (${response.status}).`)
            }

            setPassword('')
            setMessage('Login successful.')
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to log in.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="login-page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emai">Email</label>
                <input
                    id="emai"
                    type="email"
                    value={email}
                    onChange={(event) => setEmai(event.target.value)}
                    required
                />
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {message && <p>{message}</p>}
            {error && <p role="alert">{error}</p>}
        </main>
    )
}

function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage('')
        setError('')
        setIsSubmitting(true)

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            })

            if (!response.ok) {
                throw new Error(`The request failed (${response.status}).`)
            }

            setFirstName('')
            setLastName('')
            setEmail('')
            setPassword('')
            setMessage('Registration successful.')
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to register.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="register-page">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first-name">First name</label>
                <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                />
                <label htmlFor="last-name">Last name</label>
                <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                />
                <label htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <label htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p>{message}</p>}
            {error && <p role="alert">{error}</p>}
        </main>
    )
}

function GoogleLoginPage() {
    const handleLoginWithGoogle = () => {
        const returnUrl = `${window.location.origin}/user`
        window.location.href = `${apiBaseUrl}/api/auth/login/google?returnUrl=${encodeURIComponent(returnUrl)}`
    }

    return (
        <div>
            <button onClick={handleLoginWithGoogle}>
                Sign in with Google
            </button>
        </div>
    )
}

function App() {
    if (window.location.pathname === '/add-password') {
        return <AddPasswordPage />
    }

    if (window.location.pathname === '/login') {
        return <LoginPage />
    }

    if (window.location.pathname === '/register') {
        return <RegisterPage />
    }

    if (window.location.pathname === '/user') {
        return <UserPage />
    }

    if (window.location.pathname === '/login/google') {
        return <GoogleLoginPage />
    }

    if (window.location.pathname === '/add-google') {
        return <GoogleLoginPage />
    }

    return <GoogleLoginPage />
}

export default App