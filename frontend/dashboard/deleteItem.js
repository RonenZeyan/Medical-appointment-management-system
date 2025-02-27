
async function deleteItemById(path_include_item_id){
    let token = localStorage.getItem("token");
    if(confirm("Are You Sure Want to Delete It?")){
        try {
            const res = await fetch(`http://localhost:3000/api/${path_include_item_id}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            if (!res.ok) {
                throw new Error("Failed to delete item");
            }
            // alert("Item deleted successfully");
            showSuccessModal(null,`המחיקה בוצעה בהצלחה!`);
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("An error occurred while deleting the item.");
        }
    }
}