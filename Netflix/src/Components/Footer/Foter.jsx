import React from 'react'
import "./Foter.css"

const Foter = () => {
    return (
        <>
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-social">
                        <a href="http://facebook.com"><img src="src/assets/facebook_icon.png" alt="" /></a>
                        <a href="http://instagram.com"><img src="src/assets/instagram_icon.png" alt="" /></a>
                        <a href="http://twitter.com"><img src="src/assets/twitter_icon.png" alt="" /></a>
                        <a href="http://youtube.com"><img src="src/assets/youtube_icon.png" alt="" /></a>
                    </div>
                    <div class="footer-links">
                        <ul>
                            <a href="#">Audio Description</a>
                            <a href="#">Legal Notices</a>
                            <a href="#">Jobs</a>
                            <a href="#">Gift Cards</a>
                        </ul>
                        <ul>
                            <a href="#">Investor Relations</a>
                            <a href="#">Help Centre</a>
                            <a href="#">Media Centre</a>
                            <a href="#">Privacy</a>
                        </ul>
                        <ul>
                            <a href="#">Cookie Preferences</a>
                            <a href="#">Terms of Use</a>
                            <a href="#">Contact Us</a>
                        </ul>
                    </div>
                    <div class="footer-notice">
                        <p>&copy; 1997-2023 Netflix, Inc.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Foter


