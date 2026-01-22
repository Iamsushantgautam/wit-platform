import axios from 'axios';

export const addOrUpdateUpdate = async (API_URL, editingUpdate, updateForm, setUpdates, setMessage, setEditingUpdate, setUpdateForm, setSaving) => {
    setSaving(true);
    try {
        if (editingUpdate) {
            const { data } = await axios.put(`${API_URL}/profiles/updates/${editingUpdate._id}`, updateForm,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setUpdates(data);
            setMessage({ type: 'success', text: 'Update edited successfully!' });
            setTimeout(() => setMessage(null), 4000);
            setEditingUpdate(null);
        } else {
            const { data } = await axios.post(`${API_URL}/profiles/updates`, updateForm,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setUpdates(data);
            setMessage({ type: 'success', text: 'Update added successfully!' });
            setTimeout(() => setMessage(null), 4000);
        }
        setUpdateForm({ emoji: '🎉', title: '', text: '', thumbnail: '', image: '', link: '' });
    } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Failed to save update' });
        setTimeout(() => setMessage(null), 4000);
    } finally {
        setSaving(false);
    }
};

export const deleteUpdate = async (API_URL, updateId, setUpdates, setMessage) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    try {
        const { data } = await axios.delete(`${API_URL}/profiles/updates/${updateId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setUpdates(data.updates);
        setMessage({ type: 'success', text: 'Update deleted successfully!' });
        setTimeout(() => setMessage(null), 4000);
    } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Failed to delete update' });
        setTimeout(() => setMessage(null), 4000);
    }
};

export const startEditUpdate = (update, setEditingUpdate, setUpdateForm) => {
    setEditingUpdate(update);
    setUpdateForm({
        emoji: update.emoji,
        title: update.title,
        text: update.text,
        thumbnail: update.thumbnail || '',
        image: update.image || '',
        link: update.link || ''
    });
};

export const cancelEditUpdate = (setEditingUpdate, setUpdateForm) => {
    setEditingUpdate(null);
    setUpdateForm({ emoji: '🎉', title: '', text: '', thumbnail: '', image: '', link: '' });
};
