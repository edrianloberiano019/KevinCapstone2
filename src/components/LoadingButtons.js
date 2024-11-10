import React from 'react'

function LoadingButtons() {
  return (
    <div className="flex items-center justify-center">
            <div className="loader mx-2"></div>
            <style jsx>{`
                .loader {
                    border: 4px solid #f3f3f3; 
                    border-top: 8px solid #00712d9c; 
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
  )
}

export default LoadingButtons