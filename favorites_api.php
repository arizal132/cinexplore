<?php
// favorites_api.php
// API for managing user favorites

// Initialize the session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header('Content-Type: application/json');
    echo json_encode(["error" => "Not authenticated"]);
    exit;
}

// Include config file
require_once "config.php";

// Set header to JSON
header('Content-Type: application/json');

// Get the request method
$request_method = $_SERVER["REQUEST_METHOD"];

// Get user ID from session
$user_id = $_SESSION["id"];

// Process based on request method
switch($request_method) {
    // Get all favorites for a user
    case 'GET':
        $sql = "SELECT * FROM favorites WHERE user_id = ?";
        
        if($stmt = mysqli_prepare($conn, $sql)){
            mysqli_stmt_bind_param($stmt, "i", $user_id);
            
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                
                $favorites = [];
                while($row = mysqli_fetch_assoc($result)){
                    $favorites[] = [
                        'id' => $row['id'],
                        'movie_id' => $row['movie_id'],
                        'title' => $row['title'],
                        'poster' => $row['poster_path'],
                        'added_at' => $row['added_at']
                    ];
                }
                
                echo json_encode($favorites);
            } else {
                echo json_encode(["error" => "Failed to fetch favorites"]);
            }
            
            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["error" => "Database error"]);
        }
        break;
        
    // Add a new favorite
    case 'POST':
        // Get POST data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if(!isset($data['movie_id']) || !isset($data['title']) || !isset($data['poster_path'])){
            echo json_encode(["error" => "Missing required fields"]);
            exit;
        }
        
        $movie_id = $data['movie_id'];
        $title = $data['title'];
        $poster_path = $data['poster_path'];
        
        // Check if favorite already exists
        $check_sql = "SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?";
        
        if($check_stmt = mysqli_prepare($conn, $check_sql)){
            mysqli_stmt_bind_param($check_stmt, "ii", $user_id, $movie_id);
            
            if(mysqli_stmt_execute($check_stmt)){
                mysqli_stmt_store_result($check_stmt);
                
                if(mysqli_stmt_num_rows($check_stmt) > 0){
                    echo json_encode(["message" => "Movie already in favorites"]);
                    mysqli_stmt_close($check_stmt);
                    exit;
                }
            }
            
            mysqli_stmt_close($check_stmt);
        }
        
        // Insert new favorite
        $sql = "INSERT INTO favorites (user_id, movie_id, title, poster_path) VALUES (?, ?, ?, ?)";
        
        if($stmt = mysqli_prepare($conn, $sql)){
            mysqli_stmt_bind_param($stmt, "iiss", $user_id, $movie_id, $title, $poster_path);
            
            if(mysqli_stmt_execute($stmt)){
                echo json_encode([
                    "message" => "Movie added to favorites",
                    "id" => mysqli_insert_id($conn)
                ]);
            } else {
                echo json_encode(["error" => "Failed to add favorite"]);
            }
            
            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["error" => "Database error"]);
        }
        break;
        
    // Remove a favorite
    case 'DELETE':
        // Get DELETE data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if(!isset($data['movie_id'])){
            echo json_encode(["error" => "Missing movie_id"]);
            exit;
        }
        
        $movie_id = $data['movie_id'];
        
        // Delete the favorite
        $sql = "DELETE FROM favorites WHERE user_id = ? AND movie_id = ?";
        
        if($stmt = mysqli_prepare($conn, $sql)){
            mysqli_stmt_bind_param($stmt, "ii", $user_id, $movie_id);
            
            if(mysqli_stmt_execute($stmt)){
                if(mysqli_affected_rows($conn) > 0){
                    echo json_encode(["message" => "Movie removed from favorites"]);
                } else {
                    echo json_encode(["error" => "Movie not found in favorites"]);
                }
            } else {
                echo json_encode(["error" => "Failed to remove favorite"]);
            }
            
            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["error" => "Database error"]);
        }
        break;
        
    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}

// Close connection
mysqli_close($conn);
?>