
async function deleteItemById(path_include_item_id){
    if(confirm("Are You Sure Want to Delete It?")){
        try {
            const res = await fetch(`http://localhost:3000/api/${path_include_item_id}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json", 
                },
            });
    
            if (!res.ok) {
                throw new Error("Failed to delete item");
            }
            alert("Item deleted successfully");
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("An error occurred while deleting the item.");
        }
    }
}